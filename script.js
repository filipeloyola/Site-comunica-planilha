
const planilhaID = '1LhEMUgOu3BI7E8dHQI2orUOg8D-iVDWdxtR2GRN_XsE';
const gid = '390002243';  // substitua pelo gid correto da aba, se diferente
const url = `https://docs.google.com/spreadsheets/d/${planilhaID}/gviz/tq?tqx=out:json&gid=${gid}`;

let dadosPlanilha = []; // Para manter os dados brutos

fetch(url)
  .then(res => res.text())
  .then(texto => {
    const json = JSON.parse(texto.substring(47).slice(0, -2));
    const linhas = json.table.rows;
    const colunas = json.table.cols;

    // Índices das colunas com base no cabeçalho
    const idxTurma = colunas.findIndex(c => c.label.includes("turma") || c.label.includes("Turma"));
    const idxNome = colunas.findIndex(c => c.label.includes("Professor"));
    const idxTema = colunas.findIndex(c => c.label.includes("Tema"));
    const idxObjetivo = colunas.findIndex(c => c.label.includes("Objetivo"));

    // Armazenar os dados e construir dropdown
    const turmasSet = new Set();

    dadosPlanilha = linhas.map(linha => {
      const turma = linha.c[idxTurma]?.v || '';
      turmasSet.add(turma);

      return {
        turma,
        nome: linha.c[idxNome]?.v || '',
        tema: linha.c[idxTema]?.v || '',
        objetivo: linha.c[idxObjetivo]?.v || '',
      };
    });

    // Preencher dropdown
    const filtro = document.getElementById('filtroTurma');
    Array.from(turmasSet).sort().forEach(turma => {
      const opt = document.createElement('option');
      opt.value = turma;
      opt.textContent = turma;
      filtro.appendChild(opt);
    });

    filtro.addEventListener('change', () => renderizarConteudo(filtro.value));

    renderizarConteudo('todas');
  });

function renderizarConteudo(turmaSelecionada) {
  const div = document.getElementById("conteudo");
  div.innerHTML = '';

  const dadosFiltrados = turmaSelecionada === 'todas'
    ? dadosPlanilha
    : dadosPlanilha.filter(d => d.turma === turmaSelecionada);

  if (dadosFiltrados.length === 0) {
    div.innerHTML = "<p>Nenhuma aula encontrada.</p>";
    return;
  }

  dadosFiltrados.forEach(dado => {
    const bloco = document.createElement("div");
    bloco.innerHTML = `
      <h3>${dado.tema} - ${dado.turma}</h3>
      <p><strong>Professor:</strong> ${dado.nome}</p>
      <p><strong>Objetivo:</strong> ${dado.objetivo}</p>
      <hr/>
    `;
    div.appendChild(bloco);
  });
}
