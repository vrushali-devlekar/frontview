const { Readable } = require('stream');
const path = require('path');
const fs = require('fs').promises;
const asyncHandler = require('../middlewares/asyncHandler');
const Deployment = require('../models/Deployment');

function buildTargetUrl(port, restPath = '', queryString = '') {
    const normalizedPath = restPath ? `/${String(restPath).replace(/^\/+/, '')}` : '/';
    const query = queryString ? `?${queryString}` : '';
    return `http://127.0.0.1:${port}${normalizedPath}${query}`;
}

function rewriteHtmlDocument(html, deploymentId) {
    const prefix = `/live/${deploymentId}`;
    const normalizedPrefix = `${prefix}/`;
    const rewrittenAttrs = String(html)
        // Rewrite only URL-bearing HTML attributes that start from root.
        .replace(
            /(\b(?:href|src|action|poster)=["'])\/(?!\/)/gi,
            `$1${prefix}/`
        )
        // Rewrite srcset root-relative items: "/a.png 1x, /b.png 2x"
        .replace(
            /(\bsrcset=["'])([^"']*)(["'])/gi,
            (_, start, value, end) => {
                const rewritten = value.replace(/(^|,\s*)\/(?!\/)/g, `$1${prefix}/`);
                return `${start}${rewritten}${end}`;
            }
        );

    if (/<base\s+href=/i.test(rewrittenAttrs)) {
        return rewrittenAttrs;
    }

    return rewrittenAttrs.replace(
        /<head([^>]*)>/i,
        `<head$1><base href="${normalizedPrefix}">`
    );
}

function rewriteUpstreamLocation(locationHeader, deploymentId) {
    if (!locationHeader) return locationHeader;

    const prefix = `/live/${deploymentId}`;
    if (/^https?:\/\//i.test(locationHeader)) {
        try {
            const parsed = new URL(locationHeader);
            return `${prefix}${parsed.pathname}${parsed.search}${parsed.hash}`;
        } catch {
            return locationHeader;
        }
    }

    if (locationHeader.startsWith('/')) {
        return `${prefix}${locationHeader}`;
    }

    return `${prefix}/${locationHeader}`;
}

async function pathExists(targetPath) {
    try {
        await fs.access(targetPath);
        return true;
    } catch {
        return false;
    }
}

function getDeploymentRoot(deploymentId) {
    return path.resolve(__dirname, '../../deployments_temp', String(deploymentId));
}

function normalizeRestPath(restPath = '') {
    const cleaned = String(restPath || '/');
    const withoutQuery = cleaned.split('?')[0];
    return withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
}

async function resolveStaticAssetPath(deploymentId, restPath) {
    const deploymentRoot = getDeploymentRoot(deploymentId);
    const normalizedPath = normalizeRestPath(restPath);
    let relativePath = normalizedPath.replace(/^\/+/, '');
    const staticRoots = ['dist', 'build', 'public', '.next/static', ''];

    // Prevent traversal outside deployment directory
    if (relativePath.includes('..')) {
        return null;
    }

    // Recover from duplicated prefixes in cached HTML/base-href scenarios:
    // /live/<id>/assets/... should still map to /assets/...
    const duplicatePrefix = `live/${String(deploymentId)}/`;
    if (relativePath.startsWith(duplicatePrefix)) {
        relativePath = relativePath.slice(duplicatePrefix.length);
    }

    if (!relativePath || relativePath === '') {
        for (const root of ['dist', 'build', 'public', '']) {
            const indexPath = path.join(deploymentRoot, root, 'index.html');
            if (await pathExists(indexPath)) return indexPath;
        }
        return null;
    }

    for (const root of staticRoots) {
        const absolute = path.resolve(deploymentRoot, root, relativePath);
        if (!absolute.startsWith(deploymentRoot)) continue;
        if (await pathExists(absolute)) return absolute;
    }

    // SPA fallback for deep routes: return dist/build/public index.html when present
    if (!path.extname(relativePath)) {
        for (const root of ['dist', 'build', 'public', '']) {
            const indexPath = path.join(deploymentRoot, root, 'index.html');
            if (await pathExists(indexPath)) return indexPath;
        }
    }

    return null;
}

async function tryServeStaticArtifact(req, res, deploymentId, restPath) {
    const resolved = await resolveStaticAssetPath(deploymentId, restPath);
    if (!resolved) return false;

    if (resolved.endsWith('.html')) {
        const html = await fs.readFile(resolved, 'utf8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(rewriteHtmlDocument(html, deploymentId));
        return true;
    }

    res.setHeader('X-Velora-Live-Static', '1');
    res.sendFile(resolved);
    return true;
}

exports.proxyLiveDeployment = asyncHandler(async (req, res) => {
    const deployment = await Deployment.findById(req.params.id).select('status port');

    if (!deployment) {
        res.status(404);
        throw new Error('Deployment not found');
    }

    const originalPath = req.originalUrl.split('?')[0];
    const mountPrefix = `/live/${req.params.id}`;
    const restPath = originalPath.startsWith(mountPrefix)
        ? originalPath.slice(mountPrefix.length)
        : req.path;

    // Prefer serving static build assets directly from deployment folder.
    // This avoids CSS/JS MIME errors when runtime process is not available.
    if (await tryServeStaticArtifact(req, res, deployment._id, restPath || '/')) {
        return;
    }

    if (deployment.status !== 'running' || !deployment.port) {
        res.status(409);
        throw new Error(`Deployment is not live. Current status: ${deployment.status || 'unknown'}`);
    }

    const targetUrl = buildTargetUrl(
        deployment.port,
        restPath,
        req.originalUrl.includes('?') ? req.originalUrl.split('?')[1] : ''
    );

    const requestHeaders = { ...req.headers };
    delete requestHeaders.host;
    delete requestHeaders['content-length'];

    let upstreamResponse;
    try {
        upstreamResponse = await fetch(targetUrl, {
            method: req.method,
            headers: requestHeaders,
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
            duplex: ['GET', 'HEAD'].includes(req.method) ? undefined : 'half'
        });
    } catch (proxyError) {
        // Runtime may crash after first paint; serve static fallback if available.
        if (await tryServeStaticArtifact(req, res, deployment._id, restPath || '/')) {
            return;
        }
        throw proxyError;
    }

    res.status(upstreamResponse.status);

    upstreamResponse.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey === 'content-length') return;
        // HTML is rewritten by this proxy, so compressed body headers become invalid.
        if (lowerKey === 'content-encoding') return;
        if (lowerKey === 'transfer-encoding') return;
        if (key.toLowerCase() === 'content-security-policy') return;
        if (lowerKey === 'location') {
            res.setHeader(key, rewriteUpstreamLocation(value, deployment._id));
            return;
        }
        res.setHeader(key, value);
    });

    const contentType = upstreamResponse.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
        const html = await upstreamResponse.text();
        res.send(rewriteHtmlDocument(html, deployment._id));
        return;
    }

    if (!upstreamResponse.body) {
        res.end();
        return;
    }

    Readable.fromWeb(upstreamResponse.body).pipe(res);
});
