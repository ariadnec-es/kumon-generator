function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const nivel = document.querySelector('input[name="nivel"]:checked').value;
    const paginas = parseInt(document.getElementById("paginas").value);

    const tipos = [...document.querySelectorAll('input[type="checkbox"]:checked')]
        .map(e => e.value);

    if (tipos.length === 0) {
        alert("Selecione pelo menos um tipo de operação");
        return;
    }

    // ================= DÍGITOS (KUMON) =================
    function gerarNumero() {
        let d;
        if (nivel === "facil") d = Math.random() < 0.7 ? 1 : 2;
        else if (nivel === "medio") d = Math.random() < 0.5 ? 1 : 2;
        else d = Math.random() < 0.3 ? 1 : Math.random() < 0.6 ? 2 : 3;

        const min = d === 1 ? 1 : Math.pow(10, d - 1);
        const max = Math.pow(10, d) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ================= QUESTÕES =================
    function questao(tipo) {
        let a = gerarNumero();
        let b = gerarNumero();

        if (tipo === "soma")
            return `${a} + ${b} = __________`;

        if (tipo === "sub") {
            const x = Math.max(a, b);
            const y = Math.min(a, b);
            return `${x} - ${y} = __________`;
        }

        if (tipo === "mult")
            return `${a} x ${b} = __________`;

        if (tipo === "div") {
            const r = a * b;
            return `${r} / ${a} = __________`;
        }
    }

    const titulos = {
        soma: "ADIÇÃO",
        sub: "SUBTRAÇÃO",
        mult: "MULTIPLICAÇÃO",
        div: "DIVISÃO"
    };

    // ================= MEIA PÁGINA (A5) =================
    function desenharMeiaPagina(tipo, xInicio) {
        doc.setFontSize(16);
        doc.text(titulos[tipo], xInicio + 52, 20, { align: "center" });

        doc.setFontSize(13);
        let y = 40;

        for (let i = 1; i <= 10; i++) {
            doc.text(`${i}) ${questao(tipo)}`, xInicio + 12, y);
            y += 14; // espaço bom para escrita
        }
    }


    // ================= GERAR PDF =================
    let indice = 0;

    for (let p = 0; p < paginas; p++) {
        if (p > 0) doc.addPage();

        if (tipos[indice])
            desenharMeiaPagina(tipos[indice], 0);

        if (tipos[indice + 1])
            desenharMeiaPagina(tipos[indice + 1], 105);

        indice += 2;
        if (indice >= tipos.length) indice = 0;
    }

    doc.save("atividades_estilo_kumon_A5_em_A4.pdf");
}
