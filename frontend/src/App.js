import Upload from "./Upload";
import "./App.css";

function App() {
  return (
    <div style={styles.app}>
      
      {/* NAVBAR */}
      <header style={styles.navbar}>
        <h2 style={styles.logo}>💼 Finance Risk Intelligence</h2>
      </header>

      {/* MAIN CONTENT */}
      <main style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            💰 AI Financial Risk Detector
          </h1>

          <p style={styles.subtitle}>
            Upload your transaction CSV file to detect anomalies, analyze risk,
            and generate actionable insights.
          </p>

          <Upload />
        </div>
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "Inter, Arial, sans-serif",
  },
  navbar: {
    backgroundColor: "#1e293b",
    color: "#ffffff",
    padding: "16px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
  },
  logo: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 16px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "1000px",
  },
  title: {
    color: "#1e293b",
    marginBottom: "10px",
    fontWeight: "700",
    fontSize: "24px",
  },
  subtitle: {
    color: "#64748b",
    marginBottom: "25px",
    fontSize: "15px",
    lineHeight: "1.5",
  },
};

export default App;