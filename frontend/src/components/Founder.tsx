export default function Founder() {
  return (
    <section className="section container reveal" id="founder">
      <div className="section-head">
        <h2>Who's behind cloudorbit.fun</h2>
      </div>
      <div className="founder">
        <div className="founder-avatar" aria-hidden="true">
          PM
        </div>
        <div className="founder-body">
          <h3>Pankaj Modak</h3>
          <span className="founder-role">Founder, cloudorbit.fun</span>
          <p className="founder-bio">
            Pankaj started cloudorbit.fun to close the gap between what bootcamps teach and what
            engineering teams actually need on day one — hands-on CI/CD, cloud infrastructure and
            container orchestration, taught the way it's run in real production systems.
          </p>
          <div className="founder-links">
            <a
              className="linkedin-link"
              href="https://www.linkedin.com/in/pankaj-modak-57a936365/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
