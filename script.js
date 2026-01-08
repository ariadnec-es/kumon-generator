function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const fonteTitulo = 22;
    const fonteQuestoes = 18;

    let y = 20;

    // ================== FUNÇÃO DE QUESTÕES ==================
    function gerarQuestoes(tipo) {
        const questoes = new Set();

        while (questoes.size < 20) {
            let a = Math.floor(Math.random() * 11) + 2;
            let b = Math.floor(Math.random() * 11) + 2;

            if (tipo === "mult") {
                questoes.add(`${a} × ${b} = ________`);
            } else {
                questoes.add(`${a * b} ÷ ${a} = ________`);
            }
        }

        return Array.from(questoes);
    }

    // ================== PÁGINA 1 – MULTIPLICAÇÃO ==================
    doc.setFontSize(fonteTitulo);
    doc.text("Multiplicação", 105, y, { align: "center" });

    y += 15;
    doc.setFontSize(fonteQuestoes);

    const mult = gerarQuestoes("mult");

    for (let i = 0; i < mult.length; i++) {
        let x = i % 2 === 0 ? 20 : 110;
        doc.text(mult[i], x, y);

        if (i % 2 !== 0) y += 10;
    }

    // ================== PÁGINA 2 – DIVISÃO ==================
    doc.addPage();
    y = 20;

    doc.setFontSize(fonteTitulo);
    doc.text("Divisão", 105, y, { align: "center" });

    y += 15;
    doc.setFontSize(fonteQuestoes);

    const div = gerarQuestoes("div");

    for (let i = 0; i < div.length; i++) {
        let x = i % 2 === 0 ? 20 : 110;
        doc.text(div[i], x, y);

        if (i % 2 !== 0) y += 10;
    }

    // ================== SALVAR ==================
    doc.save("atividade_estilo_kumon.pdf");
}
