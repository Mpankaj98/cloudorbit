export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <a href="#top" className="logo">
          <svg className="logo-mark" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="3" fill="#5eead4" />
            <ellipse cx="14" cy="14" rx="12.5" ry="5" stroke="#5eead4" strokeWidth="1.4" />
            <ellipse
              cx="14"
              cy="14"
              rx="12.5"
              ry="5"
              stroke="#f5b942"
              strokeWidth="1.4"
              transform="rotate(60 14 14)"
            />
          </svg>
          cloudorbit.fun
        </a>
        <nav>
          <a href="#courses">Courses</a>
          <a href="#founder">Founder</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="btn btn-primary">
          Enroll now
        </a>
      </div>
    </header>
  );
}
