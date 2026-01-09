function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nivel = document.querySelector('input[name="nivel"]:checked').value;
    const paginas = parseInt(document.getElementById("paginas").value);

    const tipos = [...document.querySelectorAll('input[type="checkbox"]:checked')]
        .map(el => el.value);

    if (tipos.length === 0) {
        alert("Selecione pelo menos um tipo de questão");
        return;
    }

    // ================= GERAR NÚMERO POR DÍGITOS =================
    function gerarNumero() {
        let digitos;

        if (nivel === "facil") {
            digitos = Math.random() < 0.7 ? 1 : 2;
        } else if (nivel === "medio") {
            digitos = Math.random() < 0.5 ? 1 : 2;
        } else {
            const r = Math.random();
            digitos = r < 0.3 ? 1 : r < 0.6 ? 2 : 3;
        }

        let min = digitos === 1 ? 1 : Math.pow(10, digitos - 1);
        let max = Math.pow(10, digitos) - 1;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ================= GERAR QUESTÃO =================
    function gerarQuestao(tipo) {
        let a, b;

        if (tipo === "soma") {
            a = gerarNumero();
            b = gerarNumero();
            return `${a} + ${b} = __________`;
        }

        if (tipo === "sub") {
            a = gerarNumero();
            b = gerarNumero();
            return `${Math.max(a, b)} − ${Math.min(a, b)} = __________`;
        }

        if (tipo === "mult") {
            a = gerarNumero();
            b = gerarNumero();
            return `${a} × ${b} = __________`;
        }

        if (tipo === "div") {
            a = gerarNumero();
            b = gerarNumero();
            return `${a * b} ÷ ${a} = __________`;
        }
    }

    // ================= CRIAR PÁGINA =================
    function criarPagina(numeroPagina) {
        doc.setFontSize(16);
        doc.text(`Página ${numeroPagina}`, 105, 20, { align: "center" });

        doc.setFontSize(13);
        let y = 40;

        for (let i = 0; i < 20; i++) {
            // Escolha JUSTA do tipo
            const tipo = tipos[i % tipos.length];

            let x = i % 2 === 0 ? 25 : 110;
            doc.text(gerarQuestao(tipo), x, y);

            if (i % 2 !== 0) y += 12;
        }
    }

    // ================= GERAR PDF =================
    for (let p = 1; p <= paginas; p++) {
        if (p > 1) doc.addPage();
        criarPagina(p);
    }

    doc.save("atividade_estilo_kumon.pdf");
}
