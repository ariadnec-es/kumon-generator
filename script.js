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

    // ================= DÍGITOS POR NÍVEL =================
    function gerarNumero() {
        let digitos;

        if (nivel === "facil") {
            digitos = Math.random() < 0.7 ? 1 : 2;   // maioria 1 dígito
        }

        if (nivel === "medio") {
            digitos = Math.random() < 0.5 ? 1 : 2;   // mistura equilibrada
        }

        if (nivel === "dificil") {
            const r = Math.random();
            if (r < 0.3) digitos = 1;
            else if (r < 0.6) digitos = 2;
            else digitos = 3;                       // inclui 3 dígitos
        }

        const min = Math.pow(10, digitos - 1);
        const max = Math.pow(10, digitos) - 1;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ================= GERAR QUESTÃO =================
    function gerarQuestao() {
        let a = gerarNumero();
        let b = gerarNumero();
        let tipo = tipos[Math.floor(Math.random() * tipos.length)];

        if (tipo === "soma") {
            return `${a} + ${b} = __________`;
        }

        if (tipo === "sub") {
            return `${Math.max(a, b)} − ${Math.min(a, b)} = __________`;
        }

        if (tipo === "mult") {
            return `${a} × ${b} = __________`;
        }

        if (tipo === "div") {
            return `${a * b} ÷ ${a} = __________`; // divisão exata
        }
    }

    // ================= CRIAR PÁGINA =================
    function criarPagina(num) {
        doc.setFontSize(16);
        doc.text(`Página ${num}`, 105, 20, { align: "center" });

        doc.setFontSize(13);
        let y = 40;

        for (let i = 0; i < 20; i++) {
            let x = i % 2 === 0 ? 25 : 110;
            doc.text(gerarQuestao(), x, y);

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
