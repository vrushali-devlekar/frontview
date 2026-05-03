import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import GlassButton from '../../components/ui/GlassButton'
import StatusBadge from '../../components/ui/StatusBadge'

const Docs = () => {
  const [currentPage, setCurrentPage] = useState('overview')

  const menuItems = [
    {
      group: 'Introduction',
      pages: [
        { id: 'overview', label: 'Project Overview' },
        { id: 'objectives', label: 'Core Objectives' },
        { id: 'workflow', label: 'Platform Workflow' }
      ]
    },
    {
      group: 'System Architecture',
      pages: [
        { id: 'hld', label: 'High-Level Design' },
        { id: 'stack', label: 'Technical Stack' },
        { id: 'database', label: 'Schema Design' }
      ]
    },
    {
      group: 'Features',
      pages: [
        { id: 'deployment', label: 'Deployment Engine' },
        { id: 'ai', label: 'AI Log Analysis' },
        { id: 'scaling', label: 'Horizontal Scaling' },
        { id: 'observability', label: 'Observability Layer' }
      ]
    }
  ]

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return (
          <div className='animate-in fade-in duration-300'>
            <h1 className='text-2xl font-semibold text-white mb-8 tracking-tight'>
              Project Overview
            </h1>

            <h2 className='text-base font-medium text-white mb-3'>
              Automated Build Pipeline
            </h2>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Velora provides a specialized build environment tailored for
              high-performance MERN applications[cite: 1]. By integrating
              directly with GitHub via OAuth 2.0, the platform automates the
              transition from raw source code to a production-ready application
              bundle through an opinionated and rigorous build pipeline[cite:
              1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-8'>
              Every deployment in Velora is treated as a traceable lifecycle:
              connect repository, configure variables, run build, verify health,
              and publish endpoint. This approach gives teams a consistent
              release contract and reduces manual hand-offs between development
              and operations.
            </p>

            <h2 className='text-base font-medium text-white mb-3'>
              AI-Driven Infrastructure
            </h2>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              The platform leverages the Anthropic Claude API to provide a
              senior-level DevOps perspective on every build attempt[cite: 1].
              This infrastructure goes beyond simple log display by interpreting
              terminal output in real-time, offering actionable guidance and fix
              suggestions for complex runtime or dependency errors[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-8'>
              AI-generated guidance is contextualized with repository metadata,
              package manager signals, and historical deployment outcomes. This
              helps developers prioritize root-cause fixes rather than temporary
              patches that reappear in future builds.
            </p>

            <h2 className='text-base font-medium text-white mb-3'>
              Enterprise-Grade Security
            </h2>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Security is a foundational pillar within the Velora
              ecosystem[cite: 1]. All environment variables and GitHub access
              tokens are shielded by industry-standard AES-256-CBC encryption
              before they are persisted to the database[cite: 1]. This
              multi-layered approach ensures that production secrets remain
              confidential, even in the event of unauthorized database
              access[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-8'>
              Role-based access boundaries are enforced at API and UI levels,
              preventing accidental privilege escalation. Audit events are
              stored for high-risk actions such as token updates, member
              invites, and environment variable changes.
            </p>

            <h2 className='text-base font-medium text-white mb-3'>
              Scaling and Availability
            </h2>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Velora is architected to grow alongside modern web
              applications[cite: 1]. Utilizing PM2 cluster mode and a
              Redis-backed state management system, the platform allows
              developers to scale their applications horizontally across
              multiple server cores[cite: 1]. This ensures that high
              availability is maintained even during significant traffic spikes
              or intensive build phases[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-8'>
              Combined with health probes and automated restart policies, this
              model improves service continuity during rollout operations.
              Deployments are versioned so teams can roll back quickly if
              post-release metrics drift outside expected thresholds.
            </p>
          </div>
        )

      case 'objectives':
        return (
          <div className='animate-in fade-in duration-300'>
            <h1 className='text-2xl font-semibold text-white mb-8 tracking-tight'>
              Core Objectives
            </h1>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              The primary technical objective of Velora is to deliver a
              one-click GitHub OAuth login and repository connection flow that
              eliminates the friction of traditional deployment[cite: 1]. By
              automating the handshake between our server and the GitHub API, we
              ensure that projects can be synchronized and ready for deployment
              within seconds of a user's first login[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Velora is engineered to execute real deployments of Node.js and
              React applications through a sophisticated dual-runtime
              system[cite: 1]. For standard builds, the engine utilizes managed
              child processes, while more complex production environments
              leverage Docker containers to provide strict environment isolation
              and resource limiting[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              A critical objective is the implementation of real-time build and
              runtime log streaming via WebSockets[cite: 1]. By establishing a
              dedicated Socket.io room for every deployment, we provide
              developers with immediate visibility into their terminal output,
              transforming the deployment process from a hidden "black box" into
              a transparent and guided experience[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              The platform also prioritizes the secure injection and storage of
              environment variables using AES-256 encryption[cite: 1]. This
              ensures that sensitive keys are never stored in plain text and are
              only decrypted in memory during the build phase to be written into
              secure, temporary configuration files[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              A long-term objective is to provide policy-driven deployment
              controls where teams can define branch rules, mandatory checks,
              and protected environments. This supports safer releases for
              staging and production without reducing delivery speed.
            </p>
          </div>
        )

      case 'workflow':
        return (
          <div className='animate-in fade-in duration-300'>
            <h1 className='text-2xl font-semibold text-white mb-8 tracking-tight'>
              Platform Workflow
            </h1>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              The end-to-end workflow follows six predictable stages:
              authentication, repository selection, build configuration, preview
              deployment, production promotion, and monitoring. This standard
              sequence helps teams adopt Velora quickly across multiple
              projects.
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              During build configuration, Velora validates framework presets and
              environment variables before execution. Early validation prevents
              avoidable runtime failures and shortens feedback loops for new
              contributors.
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Once deployed, the project enters continuous monitoring mode with
              streaming logs, status snapshots, and latency indicators. Teams
              can inspect regressions immediately and coordinate response
              through a shared deployment timeline.
            </p>
          </div>
        )

      case 'hld':
        return (
          <div className='animate-in fade-in duration-300'>
            <h1 className='text-2xl font-semibold text-white mb-8 tracking-tight'>
              High-Level Design
            </h1>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Velora follows a robust three-tier architecture designed for
              maximum performance and separation of concerns[cite: 1]. The
              Presentation Layer is a React SPA client built with Vite for
              sub-second HMR and Tailwind CSS for responsive styling[cite: 1].
              The Logic Layer is a Node.js/Express API that handles business
              logic, authentication, and deployment orchestration[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              The Persistence Layer utilizes MongoDB for primary document
              storage, including user profiles, project metadata, and build
              logs[cite: 1]. This is augmented by a Redis 7 cluster which serves
              as a high-speed cache for session data and a Pub/Sub fan-out
              mechanism for WebSocket event broadcasting across multiple server
              instances[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              In the Runtime Layer, the Deployment Engine manages the full
              lifecycle of cloned repositories[cite: 1]. This engine partitions
              host ports and monitors process health, while an Nginx reverse
              proxy sits at the edge to handle load balancing and SSL
              termination for all incoming traffic[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              To support the "Gen AI" requirement, a dedicated AI Service module
              integrates with the Anthropic Claude API[cite: 1]. This service
              receives log streams and repository metadata to generate
              diagnostic fixes and deployment suggestions, which are then fed
              back to the Presentation Layer via REST endpoints[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Architecture boundaries are intentionally strict: UI modules never
              directly access infrastructure internals, and deployment runners
              never expose secret material to browser clients. This separation
              improves maintainability and strengthens security posture.
            </p>
          </div>
        )

      case 'stack':
        const techs = [
          {
            name: 'MongoDB',
            img: 'https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg'
          },
          {
            name: 'Express',
            img: 'https://www.vectorlogo.zone/logos/expressjs/expressjs-icon.svg'
          },
          {
            name: 'React',
            img: 'https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg'
          },
          {
            name: 'Node.js',
            img: 'https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg'
          },
          {
            name: 'Redis',
            img: 'https://www.vectorlogo.zone/logos/redis/redis-icon.svg'
          },
          {
            name: 'Docker',
            img: 'https://www.vectorlogo.zone/logos/docker/docker-tile.svg'
          }
        ]
        return (
          <div className='animate-in fade-in duration-300'>
            <h1 className='text-2xl font-semibold text-white mb-8 tracking-tight'>
              Technical Stack
            </h1>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
              {techs.map(t => (
                <div
                  key={t.name}
                  className='relative h-24 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-center overflow-hidden group hover:border-white/[0.12] transition-colors'
                >
                  <img
                    src={t.img}
                    className='absolute w-12 h-12 object-contain opacity-40 group-hover:opacity-100 transition-opacity'
                    alt=''
                  />
                  <span className='absolute bottom-2 text-[11px] font-medium text-[#71717a] group-hover:text-[#a1a1aa] transition-colors'>
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Our stack prioritizes developer experience and rapid response
              times[cite: 1]. By utilizing Vite and Tailwind, we achieve sub-3s
              LCP targets on the dashboard[cite: 1]. Backend performance is
              maintained through Redis caching strategies that keep API P95
              response times below 150ms[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              The ecosystem is intentionally modular, allowing gradual upgrades
              of individual components such as queue adapters, AI providers, and
              storage engines without full-platform rewrites.
            </p>
          </div>
        )

      case 'database':
        return (
          <div className='animate-in fade-in duration-300'>
            <h1 className='text-2xl font-semibold text-white mb-8 tracking-tight'>
              Schema Design
            </h1>
            <h2 className='text-base font-medium text-white mb-3'>
              Core Collections
            </h2>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-8'>
              The primary schema includes users, projects, deployments,
              environments, and logs. Each project references an owner and team
              members, while each deployment references a project, trigger
              actor, commit hash, and lifecycle status.
            </p>
            <h2 className='text-base font-medium text-white mb-3'>
              Modeling Strategy
            </h2>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Hot-read fields are denormalized for dashboard speed, while
              write-heavy event streams are separated into append-only log
              documents. This balances read performance with traceability and
              keeps operational queries predictable at scale.
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-8'>
              Compound indexes are applied on projectId plus createdAt and
              status to optimize recent deployment queries. TTL indexes can be
              used for ephemeral preview records to control storage growth.
            </p>
            <h2 className='text-base font-medium text-white mb-3'>
              Security and Compliance
            </h2>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Sensitive fields such as access tokens and environment secrets are
              encrypted before write. Audit metadata captures who changed what
              and when, enabling incident analysis and compliance-ready
              reporting.
            </p>
          </div>
        )

      case 'deployment':
        return (
          <div className='animate-in fade-in duration-300'>
            <h1 className='text-2xl font-semibold text-white mb-8 tracking-tight'>
              Deployment Engine
            </h1>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              The Velora Deployment Engine is an asynchronous orchestrator that
              begins by validating a user's GitHub credentials before triggering
              a repository clone[cite: 1]. It utilizes the `child_process`
              module in Node.js to execute shell commands within a chrooted
              directory for security[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Once the repository is cloned to the local filesystem, the engine
              identifies the project type and executes the appropriate
              dependency installation scripts[cite: 1]. Build output is streamed
              character-by-character to the client UI, ensuring the developer
              has full visibility during intensive installation phases[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              After a successful build, the engine assigns a dynamic host port
              from a pre-configured pool (3100-4000) and launches the
              application using PM2[cite: 1]. The deployment document in MongoDB
              is updated with the live URL and port number, and a completion
              event is emitted via Socket.io to the dashboard[cite: 1].
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Retry windows and failure-state classifications are applied to
              every step so the engine can distinguish dependency failures from
              runtime crashes. This improves incident triage and enables
              targeted remediation workflows.
            </p>
          </div>
        )

      case 'ai':
        return (
          <div className='animate-in fade-in duration-300'>
            <h1 className='text-2xl font-semibold text-white mb-8 tracking-tight'>
              AI Log Analysis
            </h1>
            <h2 className='text-base font-medium text-white mb-3'>
              Log Ingestion Pipeline
            </h2>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-8'>
              Velora ingests build and runtime logs as structured chunks tagged
              by phase, timestamp, and source process. Chunking reduces token
              waste and allows the AI service to focus on high-signal failure
              segments.
            </p>
            <h2 className='text-base font-medium text-white mb-3'>
              Failure Detection
            </h2>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-8'>
              Error signatures such as dependency conflicts, missing environment
              variables, memory pressure, and port collisions are detected
              before prompt generation. This pre-classification improves
              recommendation quality and reduces noisy suggestions.
            </p>
            <h2 className='text-base font-medium text-white mb-3'>
              Actionable Recommendations
            </h2>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              The assistant returns prioritized fixes with confidence hints,
              estimated impact, and safe rollback notes. Developers can apply
              the proposed command sequence directly or copy a checklist into
              team incident threads.
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Over time, repeated patterns are stored as internal playbooks so
              common failures can be auto-suggested instantly in future
              deployments.
            </p>
          </div>
        )

      case 'scaling':
        return (
          <div className='animate-in fade-in duration-300'>
            <h1 className='text-2xl font-semibold text-white mb-8 tracking-tight'>
              Horizontal Scaling
            </h1>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Velora scales application workloads by distributing traffic across
              multiple process instances and hosts. PM2 cluster mode and reverse
              proxy balancing provide efficient CPU utilization during peak
              load.
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Stateless service design is encouraged for API layers, with Redis
              used for shared sessions and coordination signals. This ensures
              new instances can be attached or detached without user-facing
              session loss.
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Autoscaling policies can be driven by CPU, memory, queue depth,
              and request latency. Combined with health checks, this allows
              elastic growth while maintaining predictable response times.
            </p>
          </div>
        )

      case 'observability':
        return (
          <div className='animate-in fade-in duration-300'>
            <h1 className='text-2xl font-semibold text-white mb-8 tracking-tight'>
              Observability Layer
            </h1>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              The observability layer combines logs, metrics, and deployment
              events into a single timeline. Teams can correlate build changes
              with latency spikes or error bursts in minutes.
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Alerting thresholds are configurable per environment to avoid
              notification fatigue. Critical alerts include direct links to the
              exact deployment, commit, and AI diagnosis context.
            </p>
            <p className='text-[14px] text-[#a1a1aa] leading-relaxed mb-6'>
              Historical trend views support capacity planning by showing median
              build duration, failure ratio, and recovery time over release
              cycles.
            </p>
          </div>
        )

      default:
        return (
          <div className='text-[14px] text-[#71717a] italic animate-pulse'>
            Documentation node initialized... select a sector.
          </div>
        )
    }
  }

  return (
    <div className='min-h-screen bg-[#09090b] text-[#d4d4d8] font-sans flex flex-col'>
      <nav className='sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-md'>
        <div className='mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4'>
          <NavLink
            to='/'
            className='flex items-center gap-2.5 text-lg font-bold tracking-tight text-white'
          >
            <img
              src={logo}
              alt='Velora Logo'
              className='h-6 w-auto object-contain'
            />
            Velora
          </NavLink>

          <div className='hidden md:flex gap-8 text-[13px] font-medium text-[#71717a]'>
            <NavLink to='/' className='hover:text-white transition-colors'>
              Home
            </NavLink>
            <span className='text-white'>Docs</span>
            <NavLink to='/login' className='hover:text-white transition-colors'>
              Log In
            </NavLink>
          </div>

          <NavLink to='/dashboard'>
            <GlassButton variant='primary' className='h-9 px-4 text-[13px]'>Launch Dashboard</GlassButton>
          </NavLink>
        </div>
      </nav>

      <section className='relative border-b border-white/[0.06] bg-[#111113]'>
        <div className='relative mx-auto max-w-[1200px] px-6 py-16 md:py-24'>
          <div className='mb-8 flex flex-wrap gap-x-4 gap-y-3'>
            <StatusBadge status='Documentation Online' type='success' />
            <StatusBadge status='Schema Ready' type='warning' />
            <StatusBadge status='AI Guidance Active' type='neutral' />
          </div>

          <h1 className='max-w-2xl text-[32px] md:text-[48px] font-bold leading-tight tracking-tight text-white'>
            Velora Platform Documentation
          </h1>

          <p className='mt-6 max-w-2xl text-[16px] leading-relaxed text-[#a1a1aa]'>
            Browse platform overview, schema design, AI log analysis, scaling,
            deployment internals, and observability. Learn how Velora streamlines
            the lifecycle from git push to production rollout.
          </p>
        </div>
      </section>

      <div className='flex flex-1 mx-auto w-full max-w-[1200px] px-6'>
        {/* --- SIDEBAR --- */}
        <aside className='w-64 py-10 pr-8 hidden md:block sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto' style={{ scrollbarWidth: 'none' }}>
          <nav className='space-y-8'>
            {menuItems.map(group => (
              <div key={group.group}>
                <h4 className='text-[13px] font-semibold text-white mb-3'>
                  {group.group}
                </h4>
                <ul className='space-y-1'>
                  {group.pages.map(page => (
                    <li
                      key={page.id}
                      onClick={() => setCurrentPage(page.id)}
                      className={`w-full text-left px-3 py-2 text-[13px] font-medium rounded-md cursor-pointer transition-colors ${currentPage === page.id
                          ? 'bg-white/[0.06] text-white'
                          : 'text-[#a1a1aa] hover:text-white hover:bg-white/[0.02]'
                        }`}
                    >
                      {page.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* --- CONTENT --- */}
        <main className='flex-1 py-10 md:pl-10 lg:pl-16'>
          <div className='max-w-[700px]'>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Docs