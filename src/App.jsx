import React, { useState } from "react";
import jsPDF from "jspdf";

export default function BudgetApp() {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ name: "", time: 0, complexity: 0, cost: 0 });
  const [budget, setBudget] = useState(null);
  const [editing, setEditing] = useState(false);

  const addItem = () => {
    if (!currentItem.name) return;
    setItems([...items, currentItem]);
    setCurrentItem({ name: "", time: 0, complexity: 0, cost: 0 });
  };

  const calculateBudget = () => {
    if (items.length === 0) return;
    const total = items.reduce((acc, item) => {
      acc.time += Number(item.time);
      acc.complexity += Number(item.complexity);
      acc.cost += Number(item.cost);
      return acc;
    }, { time: 0, complexity: 0, cost: 0 });

    const avg = {
      time: (total.time / items.length).toFixed(1),
      complexity: (total.complexity / items.length).toFixed(1),
      cost: (total.cost / items.length).toFixed(2),
    };

    setBudget(avg);
    setEditing(false);
  };

  const updateBudget = (field, value) => {
    let time = Number(budget.time);
    let complexity = Number(budget.complexity);
    let cost = Number(budget.cost);
    const v = Number(value);

    if (field === "time") {
      time = v;
      complexity = v <= 5 ? 3 : 8;
      cost = v <= 5 ? 1000 : 500;
    } else if (field === "complexity") {
      complexity = v;
      time = v >= 7 ? 10 : 3;
      cost = v >= 7 ? 2000 : 800;
    } else if (field === "cost") {
      cost = v;
      time = v >= 2000 ? 10 : 4;
      complexity = v >= 2000 ? 8 : 2;
    }

    setBudget({ time, complexity, cost });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Resumo do Orçamento", 20, 20);
    doc.setFontSize(12);
    doc.text(`Tempo médio: ${budget.time}`, 20, 40);
    doc.text(`Complexidade média: ${budget.complexity}`, 20, 50);
    doc.text(`Custo médio: R$ ${budget.cost}`, 20, 60);
    doc.save("orcamento.pdf");
  };

  const shareText = encodeURIComponent(
    `Resumo do Orçamento:\nTempo médio: ${budget?.time}\nComplexidade média: ${budget?.complexity}\nCusto médio: R$ ${budget?.cost}`
  );

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${shareText}`,
    email: `mailto:?subject=Orçamento&body=${shareText}`,
    discord: `https://discord.com/channels/@me`,
    instagram: `https://www.instagram.com/`
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>App de Orçamentos com IA</h1>

      <div style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
        <input placeholder="Nome do item" value={currentItem.name}
          onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
          style={{ marginBottom: "0.5rem", width: "100%", padding: "0.5rem" }} />
        <input type="number" placeholder="Tempo" value={currentItem.time}
          onChange={(e) => setCurrentItem({ ...currentItem, time: e.target.value })}
          style={{ marginBottom: "0.5rem", width: "100%", padding: "0.5rem" }} />
        <input type="number" placeholder="Complexidade" value={currentItem.complexity}
          onChange={(e) => setCurrentItem({ ...currentItem, complexity: e.target.value })}
          style={{ marginBottom: "0.5rem", width: "100%", padding: "0.5rem" }} />
        <input type="number" placeholder="Custo" value={currentItem.cost}
          onChange={(e) => setCurrentItem({ ...currentItem, cost: e.target.value })}
          style={{ marginBottom: "0.5rem", width: "100%", padding: "0.5rem" }} />
        <button onClick={addItem} style={{ padding: "0.5rem 1rem" }}>Adicionar Item</button>
      </div>

      <button onClick={calculateBudget} style={{ padding: "0.5rem 1rem", marginBottom: "1rem" }}>Gerar Orçamento</button>

      {budget && (
        <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.2rem" }}>Resumo do Orçamento</h2>
          {editing ? (
            <>
              <input type="number" value={budget.time}
                onChange={(e) => updateBudget("time", e.target.value)}
                style={{ marginBottom: "0.5rem", width: "100%", padding: "0.5rem" }} />
              <input type="number" value={budget.complexity}
                onChange={(e) => updateBudget("complexity", e.target.value)}
                style={{ marginBottom: "0.5rem", width: "100%", padding: "0.5rem" }} />
              <input type="number" value={budget.cost}
                onChange={(e) => updateBudget("cost", e.target.value)}
                style={{ marginBottom: "0.5rem", width: "100%", padding: "0.5rem" }} />
            </>
          ) : (
            <>
              <p>Tempo médio: {budget.time}</p>
              <p>Complexidade média: {budget.complexity}</p>
              <p>Custo médio: R$ {budget.cost}</p>
            </>
          )}

          <button onClick={() => setEditing(!editing)} style={{ marginTop: "0.5rem", marginRight: "0.5rem" }}>
            {editing ? "Salvar" : "Editar Variáveis"}
          </button>
          <button onClick={exportToPDF}>Exportar PDF</button>

          <div style={{ marginTop: "1rem" }}>
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">Compartilhar no WhatsApp</a><br />
            <a href={shareLinks.email} target="_blank" rel="noopener noreferrer">Compartilhar por Email</a><br />
            <a href={shareLinks.discord} target="_blank" rel="noopener noreferrer">Compartilhar no Discord</a><br />
            <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer">Abrir Instagram</a>
          </div>
        </div>
      )}
    </div>
  );
}
