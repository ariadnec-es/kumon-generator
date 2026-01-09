function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("l", "mm", "a4");

    const nivel = document.getElementById("nivel").value;
    const paginas = parseInt(document.getElementById("paginas").value);
    const operacao = document.querySelector('input[name="operacao"]:checked').value;

    /* ================= CABEÇALHO ================= */
    function cabecalho() {
        doc.setFontSize(11);
        doc.text("Nome:", 10, 15);
        doc.line(30, 15, 100, 15);

        doc.text("Data:", 10, 22);
        doc.line(30, 22, 100, 22);

        doc.text("Hora:", 10, 29);
        doc.line(30, 29, 55, 29);
        doc.text("às", 58, 29);
        doc.line(65, 29, 90, 29);
    }

    /* ================= NÚMEROS – REGRAS KUMON ================= */
    function gerarNumero() {
        if (nivel === "A") return Math.floor(Math.random() * 9) + 1;
        if (nivel === "B") return Math.floor(Math.random() * 9) + 1;
        if (nivel === "C") return Math.floor(Math.random() * 90) + 10;
        if (nivel === "D") return Math.floor(Math.random() * 5) + 1;
        if (nivel === "E") return Math.floor(Math.random() * 9) + 1;
        return Math.floor(Math.random() * 9) + 2; // F
    }

    function gerarConta() {
        let a = gerarNumero();
        let b = gerarNumero();
        let op;

        switch (operacao) {
            case "Adição":
                op = "+";
                if (nivel === "A") b = Math.min(b, 9 - a); // sem vai-um
                break;

            case "Subtração":
                op = "-";
                if (nivel === "A") b = Math.min(b, a); // sem negativo
                [a, b] = [Math.max(a, b), Math.min(a, b)];
                break;

            case "Multiplicação":
                op = "×";
                if (nivel === "D") {
                    a = Math.floor(Math.random() * 5) + 1;
                    b = Math.floor(Math.random() * 5) + 1;
                }
                if (nivel === "E") {
                    a = Math.floor(Math.random() * 4) + 6;
                    b = Math.floor(Math.random() * 4) + 6;
                }
                break;

            case "Divisão":
                op = "÷";
                b = gerarNumero();
                const r = Math.floor(Math.random() * 9) + 1;
                a = b * r; // divisão exata
                break;
        }

        return { a, b, op };
    }

    /* ================= QUESTÕES ================= */
    function desenharQuestoes(x, inicio) {
        let y = 60;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(
            `${operacao.toUpperCase()} – NÍVEL ${nivel}`,
            x + 10,
            45
        );

        for (let i = 0; i < 10; i++) {
            const c = gerarConta();

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(`(${inicio + i})`, x + 10, y);

            doc.setFontSize(24);
            doc.text(String(c.a).padStart(3, " "), x + 30, y);
            doc.text(c.op, x + 55, y);
            doc.text(String(c.b).padStart(3, " "), x + 70, y);
            doc.text("=", x + 95, y);

            y += 12;
        }
    }

    /* ================= GERAR PDF ================= */
    for (let p = 0; p < paginas; p++) {
        if (p > 0) doc.addPage();

        cabecalho();
        desenharQuestoes(0, 1);       // 1–10
        desenharQuestoes(148.5, 11);  // 11–20
    }

    doc.save(`kumon_${operacao}_nivel_${nivel}.pdf`);
}
