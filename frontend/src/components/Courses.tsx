const COURSES = [
  {
    tag: "CI",
    title: "CI/CD",
    body: "Build pipelines with Jenkins, GitHub Actions and GitLab CI that ship safely, on every commit.",
  },
  {
    tag: "AWS",
    title: "Cloud & AWS",
    body: "EC2, VPC, IAM and the core AWS services behind production infrastructure.",
  },
  {
    tag: "K8S",
    title: "Docker & Kubernetes",
    body: "Containerize applications and orchestrate them at scale with Kubernetes.",
  },
  {
    tag: "MON",
    title: "Monitoring",
    body: "Prometheus, Grafana and alerting that catches problems before your users do.",
  },
];

export default function Courses() {
  return (
    <section className="section container reveal" id="courses">
      <div className="section-head">
        <h2>Four tracks, one cohort</h2>
        <p>Pick a track to start with — most students move through more than one.</p>
      </div>
      <div className="course-track">
        {COURSES.map((c) => (
          <div className="course-stop" key={c.title}>
            <div className="course-node">{c.tag}</div>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
