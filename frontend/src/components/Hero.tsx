import awsLogo from "../assets/aws-logo.png";

export default function Hero() {
  return (
    <section className="hero container" id="top">
      <div className="hero-copy">
        <h1>Learn the DevOps practices cloud teams actually hire for.</h1>
        <p className="lede">
          cloudorbit.fun runs focused, mentor-led cohorts in CI/CD, cloud infrastructure,
          containers and monitoring — taught by engineers who run these systems in production
          every day.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="btn btn-primary">
            Get course details
          </a>
          <a href="#courses" className="btn btn-ghost">
            See what you'll learn
          </a>
        </div>
        <div className="hero-stats">
          <div>
            <strong>4</strong>
            <span>core tracks</span>
          </div>
          <div>
            <strong>1:1</strong>
            <span>mentor reviews</span>
          </div>
          <div>
            <strong>Bengaluru</strong>
            <span>home base</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="tech-stack" aria-label="Technologies you'll learn">
          <img src="https://cdn.simpleicons.org/linux/8ba0b3" alt="Linux" title="Linux" loading="lazy" />
          <img src="https://cdn.simpleicons.org/docker/8ba0b3" alt="Docker" title="Docker" loading="lazy" />
          <img
            src="https://cdn.simpleicons.org/kubernetes/8ba0b3"
            alt="Kubernetes"
            title="Kubernetes"
            loading="lazy"
          />
          <img src={awsLogo} alt="AWS" title="AWS" className="aws-icon" loading="lazy" />
          <img
            src="https://cdn.simpleicons.org/terraform/8ba0b3"
            alt="Terraform"
            title="Terraform"
            loading="lazy"
          />
          <img src="https://cdn.simpleicons.org/ansible/8ba0b3" alt="Ansible" title="Ansible" loading="lazy" />
          <img
            src="https://cdn.simpleicons.org/githubactions/8ba0b3"
            alt="GitHub Actions"
            title="GitHub Actions"
            loading="lazy"
          />
          <img src="https://cdn.simpleicons.org/gitlab/8ba0b3" alt="GitLab" title="GitLab" loading="lazy" />
          <img
            src="https://cdn.simpleicons.org/prometheus/8ba0b3"
            alt="Prometheus"
            title="Prometheus"
            loading="lazy"
          />
          <img src="https://cdn.simpleicons.org/grafana/8ba0b3" alt="Grafana" title="Grafana" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
