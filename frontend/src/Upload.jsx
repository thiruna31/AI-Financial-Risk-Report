import axios from "axios";
import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COLORS = ["#4caf50", "#f44336"];

export default function Upload() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  
  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("❌ Please upload CSV only");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "❌ Upload failed");
      setData([]);
    }
  };

 
  const filteredData = data
    .filter((row) =>
      (row.vendor ?? "")
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((row) => {
      if (filterRisk === "risk")
        return String(row.status).toLowerCase().includes("high");
      if (filterRisk === "safe")
        return String(row.status).toLowerCase().includes("safe");
      return true;
    });

  
  const downloadPDF = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();
    doc.text("AI Financial Risk Report", 14, 15);

    const tableData = filteredData.map((row) => [
      row.amount,
      row.vendor,
      row.status,
      row.risk_score,
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["Amount", "Vendor", "Status", "Risk Score"]],
      body: tableData,
      styles: { fontSize: 8 },
    });

    doc.save("report.pdf");
  };

  const total = filteredData.length;
  const risk = filteredData.filter((d) =>
    String(d.status).toLowerCase().includes("high")
  ).length;
  const safe = total - risk;

  const chartData = [
    { name: "Safe", value: safe },
    { name: "Risk", value: risk },
  ];

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: darkMode ? "#1e293b" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827"
      }}
    >
      {/* CONTROLS */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <Button variant="contained" component="label">
          Upload CSV
          <input hidden type="file" onChange={handleUpload} />
        </Button>

        <TextField
          label="Search Vendor"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          size="small"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="safe">Safe</MenuItem>
          <MenuItem value="risk">High Risk</MenuItem>
        </Select>

        <Button variant="outlined" onClick={downloadPDF}>
          Download PDF
        </Button>

        <Button variant="outlined" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </Box>

      {/* KPI CARDS */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: darkMode ? "#334155" : "#fff" }}>
            <CardContent>
              <Typography>Total</Typography>
              <Typography variant="h5">{total}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: darkMode ? "#334155" : "#fff" }}>
            <CardContent>
              <Typography>Safe</Typography>
              <Typography color="green">{safe}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: darkMode ? "#334155" : "#fff" }}>
            <CardContent>
              <Typography>Risk</Typography>
              <Typography color="red">{risk}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* PIE CHART */}
      {total > 0 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <PieChart width={350} height={280}>
            <Pie data={chartData} dataKey="value" outerRadius={90}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Box>
      )}

      {/* TABLE */}
      {filteredData.length > 0 && (
        <table
          style={{
            marginTop: "20px",
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr
              style={{
                background: darkMode ? "#334155" : "#111827",
                color: "#ffffff"
              }}
            >
              <th>Amount</th>
              <th>Vendor</th>
              <th>Status</th>
              <th>Risk Score</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, i) => (
              <tr
                key={i}
                style={{
                  backgroundColor: String(row.status)
                    .toLowerCase()
                    .includes("high")
                    ? (darkMode ? "#7f1d1d" : "#fee2e2")
                    : (darkMode ? "#14532d" : "#dcfce7"),
                  color: darkMode ? "#ffffff" : "#111827"
                }}
              >
                <td>${row.amount}</td>
                <td>{row.vendor}</td>
                <td>{row.status}</td>
                <td>{row.risk_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Box>
  );
}