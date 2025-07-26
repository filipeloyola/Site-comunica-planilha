
const planilhaID = '1LhEMUgOu3BI7E8dHQI2orUOg8D-iVDWdxtR2GRN_XsE';
const gid = '390002243';  // substitua pelo gid correto da aba, se diferente
const url = `https://docs.google.com/spreadsheets/d/${planilhaID}/gviz/tq?tqx=out:json&gid=${gid}`;

fetch(url)
  .then(res => res.text())
  .then(data => {
    const json = JSON.parse(data.substr(47).slice(0, -2));
    const linhas = json.table.rows;
    const conteudo = document.getElementById("conteudo-aulas");
    conteudo.innerHTML = ""; // limpar "Carregando..."

    linhas.forEach((linha, index) => {
      if (!linha.c || linha.c.length < 5) return;

      const dataHora = linha.c[0]?.v || "";
      const professor = linha.c[1]?.v || "";
      const turma = linha.c[2]?.v || "";
      const tema = linha.c[3]?.v || "";
      const objetivo = linha.c[4]?.v || "";

      const card = document.createElement("div");
      card.className = "aula-card";

      card.innerHTML = `
        <h2>${tema}</h2>
        <div class="aula-meta">
          Professor: <strong>${professor}</strong><br>
          Turma: <strong>${turma}</strong><br>
          Data/hora: ${dataHora}
        </div>
        <p class="objetivo"><strong>Objetivo:</strong><br>${objetivo}</p>
      `;

      conteudo.appendChild(card);
    });
  });
