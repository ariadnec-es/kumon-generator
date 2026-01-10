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
        doc.line(30, 15, 120, 15);

        doc.text("Data:", 10, 22);
        doc.line(30, 22, 120, 22);

        doc.text("Hora:", 10, 29);
        doc.line(30, 29, 55, 29);
        doc.text("às", 58, 29);
        doc.line(65, 29, 90, 29);
    }

    /* ================= INTERVALOS KUMON ================= */
    function intervalo(nivel, tipo) {
        const regras = {
            A: { add: [1, 9], mul: [1, 3] },
            B: { add: [1, 9], mul: [1, 5] },
            C: { add: [10, 99], mul: [1, 9], div: true },
            D: { add: [10, 99], mul: [1, 5], div: true },
            E: { add: [10, 999], mul: [6, 9], div: true },
            F: { add: [100, 9999], mul: [2, 9], div: true }
        };
        return regras[nivel][tipo];
    }

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* ================= GERAR CONTA ================= */
    function gerarConta() {
        let a, b, op;

        // ===== ADIÇÃO =====
        if (operacao === "Adição") {
            if (nivel === "A") {
                a = rand(1, 9);
                b = rand(1, 9 - a); // garante sem vai-um
            }
            else if (nivel === "B") {
                a = rand(1, 9);
                b = rand(1, 9);
            }
            else if (nivel === "C" || nivel === "D") {
                a = rand(10, 99);
                b = rand(10, 99);
            }
            else if (nivel === "E") {
                a = rand(10, 999);
                b = rand(10, 999);
            }
            else { // F
                a = rand(100, 9999);
                b = rand(100, 9999);
            }
            op = "+";
        }

        // ===== SUBTRAÇÃO =====
        else if (operacao === "Subtração") {
            if (nivel === "A") {
                a = rand(1, 9);
                b = rand(1, a); // sem negativo
            }
            else if (nivel === "B") {
                a = rand(1, 9);
                b = rand(1, 9);
            }
            else if (nivel === "C" || nivel === "D") {
                a = rand(10, 99);
                b = rand(10, 99);
            }
            else if (nivel === "E") {
                a = rand(10, 999);
                b = rand(10, 999);
            }
            else {
                a = rand(100, 9999);
                b = rand(100, 9999);
            }
            if (b > a) [a, b] = [b, a];
            op = "-";
        }

        // ===== MULTIPLICAÇÃO =====
        else if (operacao === "Multiplicação") {
            if (nivel === "A") {
                a = rand(1, 3);
                b = rand(1, 3);
            }
            else if (nivel === "B") {
                a = rand(1, 5);
                b = rand(1, 5);
            }
            else if (nivel === "C") {
                a = rand(2, 9);
                b = rand(2, 9);
            }
            else if (nivel === "D") {
                a = rand(2, 99);
                b = rand(1, 5);
            }
            else if (nivel === "E") {
                a = rand(10, 99);
                b = rand(6, 9);
            }
            else {
                a = rand(10, 999);
                b = rand(2, 9);
            }
            op = "×";
        }

        // ===== DIVISÃO =====
        else if (operacao === "Divisão") {
            let divisor, quociente;

            if (nivel === "C" || nivel === "D") {
                divisor = rand(2, 9);
                quociente = rand(2, 9);
            }
            else if (nivel === "E") {
                divisor = rand(2, 9);
                quociente = rand(10, 99);
            }
            else {
                divisor = rand(2, 9);
                quociente = rand(10, 999);
            }

            a = divisor * quociente;
            b = divisor;
            op = "÷";
        }

        return { a, b, op };
    }


    /* ================= QUESTÕES ================= */
    function desenharQuestoes(x, inicio) {
        let y = 60;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(`${operacao.toUpperCase()} – NÍVEL ${nivel}`, x + 10, 45);

        for (let i = 0; i < 10; i++) {
            const c = gerarConta();
            if (!c) continue;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(`(${inicio + i})`, x + 10, y);

            doc.setFontSize(24);
            doc.text(String(c.a), x + 30, y);
            doc.text(c.op, x + 60, y);
            doc.text(String(c.b), x + 75, y);
            doc.text("=", x + 100, y);

            y += 12;
        }
    }

    /* ================= GERAR PDF ================= */
    for (let p = 0; p < paginas; p++) {
        if (p > 0) doc.addPage();

        cabecalho();
        desenharQuestoes(0, 1);       // (1)–(10)
        desenharQuestoes(148.5, 11);  // (11)–(20)
    }

    doc.save(`kumon_${operacao}_nivel_${nivel}.pdf`);
}
