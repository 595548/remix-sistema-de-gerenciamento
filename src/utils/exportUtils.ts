import { jsPDF } from 'jspdf';
import { Book, Reader, Loan } from '../types/library';

export function exportBooksToCSV(books: Book[]): void {
  const headers = ['Tombo', 'Título da Obra', 'Autor', 'Estante', 'Gênero Literário', 'Ano', 'Disponível', 'Data Cadastro'];
  const rows = books.map(b => [
    `"${b.tombo}"`,
    `"${b.titulo.replace(/"/g, '""')}"`,
    `"${b.autor.replace(/"/g, '""')}"`,
    `"${b.estante}"`,
    `"${b.genero}"`,
    `"${b.ano}"`,
    `"${b.disponivel}"`,
    `"${b.dataCadastro}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `acervo_biblioteca_valdiva_colaco_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportLoansToCSV(loans: Loan[]): void {
  const headers = ['ID Empréstimo', 'Tombo', 'Livro', 'Leitor', 'Categoria', 'Turma', 'Data Empréstimo', 'Devolução Prevista', 'Status', 'Bibliotecária'];
  const rows = loans.map(l => [
    `"${l.id}"`,
    `"${l.livroTombo}"`,
    `"${l.livroTitulo.replace(/"/g, '""')}"`,
    `"${l.leitorNome.replace(/"/g, '""')}"`,
    `"${l.leitorCategoria}"`,
    `"${l.leitorTurma || '-'}"`,
    `"${l.dataEmprestimo}"`,
    `"${l.dataDevolucaoPrevista}"`,
    `"${l.status}"`,
    `"${l.bibliotecariaResponsavel}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `emprestimos_biblioteca_valdiva_colaco_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToXML(books: Book[], readers: Reader[], loans: Loan[]): void {
  const xmlParts: string[] = [];
  xmlParts.push('<?xml version="1.0" encoding="UTF-8"?>');
  xmlParts.push('<biblioteca_valdiva_colaco>');
  xmlParts.push('  <metadados>');
  xmlParts.push('    <instituicao>EMEF Desembargador Pedro de Queiroz</instituicao>');
  xmlParts.push('    <biblioteca>Biblioteca Valdiva Colaço</biblioteca>');
  xmlParts.push('    <projeto>Xenia Cardoso</projeto>');
  xmlParts.push('    <ano>2026</ano>');
  xmlParts.push('    <bibliotecaria_chefe>Ada Melo</bibliotecaria_chefe>');
  xmlParts.push(`    <data_geracao>${new Date().toISOString()}</data_geracao>`);
  xmlParts.push('  </metadados>');

  xmlParts.push('  <acervo>');
  books.forEach(b => {
    xmlParts.push('    <livro>');
    xmlParts.push(`      <tombo>${escapeXml(b.tombo)}</tombo>`);
    xmlParts.push(`      <titulo>${escapeXml(b.titulo)}</titulo>`);
    xmlParts.push(`      <autor>${escapeXml(b.autor)}</autor>`);
    xmlParts.push(`      <estante>${escapeXml(b.estante)}</estante>`);
    xmlParts.push(`      <genero>${escapeXml(b.genero)}</genero>`);
    xmlParts.push(`      <ano>${b.ano}</ano>`);
    xmlParts.push(`      <disponivel>${escapeXml(b.disponivel)}</disponivel>`);
    xmlParts.push('    </livro>');
  });
  xmlParts.push('  </acervo>');

  xmlParts.push('  <leitores>');
  readers.forEach(r => {
    xmlParts.push('    <leitor>');
    xmlParts.push(`      <id>${escapeXml(r.id)}</id>`);
    xmlParts.push(`      <nome>${escapeXml(r.nome)}</nome>`);
    xmlParts.push(`      <categoria>${escapeXml(r.categoria)}</categoria>`);
    if (r.categoria === 'aluno') {
      xmlParts.push(`      <serie>${escapeXml(r.serie || '')}</serie>`);
      xmlParts.push(`      <turma>${escapeXml(r.turma || '')}</turma>`);
      xmlParts.push(`      <turno>${escapeXml(r.turno || '')}</turno>`);
    }
    xmlParts.push(`      <matricula>${escapeXml(r.matricula || '')}</matricula>`);
    xmlParts.push(`      <telefone>${escapeXml(r.telefone || '')}</telefone>`);
    xmlParts.push('    </leitor>');
  });
  xmlParts.push('  </leitores>');

  xmlParts.push('  <emprestimos>');
  loans.forEach(l => {
    xmlParts.push('    <emprestimo>');
    xmlParts.push(`      <id>${escapeXml(l.id)}</id>`);
    xmlParts.push(`      <livro_tombo>${escapeXml(l.livroTombo)}</livro_tombo>`);
    xmlParts.push(`      <livro_titulo>${escapeXml(l.livroTitulo)}</livro_titulo>`);
    xmlParts.push(`      <leitor_nome>${escapeXml(l.leitorNome)}</leitor_nome>`);
    xmlParts.push(`      <data_emprestimo>${escapeXml(l.dataEmprestimo)}</data_emprestimo>`);
    xmlParts.push(`      <data_devolucao_prevista>${escapeXml(l.dataDevolucaoPrevista)}</data_devolucao_prevista>`);
    xmlParts.push(`      <status>${escapeXml(l.status)}</status>`);
    xmlParts.push('    </emprestimo>');
  });
  xmlParts.push('  </emprestimos>');
  xmlParts.push('</biblioteca_valdiva_colaco>');

  const xmlBlob = new Blob([xmlParts.join('\n')], { type: 'application/xml;charset=utf-8;' });
  const url = URL.createObjectURL(xmlBlob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `backup_biblioteca_valdiva_colaco_${new Date().toISOString().slice(0, 10)}.xml`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export function exportToJSON(books: Book[], readers: Reader[], loans: Loan[]): void {
  const payload = {
    instituicao: 'EMEF Desembargador Pedro de Queiroz',
    biblioteca: 'Biblioteca Valdiva Colaço',
    projeto: 'Xenia Cardoso',
    ano: 2026,
    bibliotecaria: 'Ada Melo',
    dataExportacao: new Date().toISOString(),
    totalLivros: books.length,
    acervo: books,
    leitores: readers,
    emprestimos: loans,
  };

  const jsonBlob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(jsonBlob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `acervo_completo_valdiva_colaco_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateOfficialPDF(books: Book[], loans: Loan[], activeAssistant: string): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  let y = margin;

  // Header Box
  doc.setFillColor(30, 64, 175); // Navy Blue (#1e40af)
  doc.rect(margin, y, pageWidth - (margin * 2), 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('EMEF DESEMBARGADOR PEDRO DE QUEIROZ', margin + 6, y + 8);

  doc.setFontSize(11);
  doc.text('BIBLIOTECA VALDIVA COLAÇO — RELATÓRIO OFICIAL DO ACERVO', margin + 6, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Projeto: Xenia Cardoso | Responsável: ${activeAssistant} | Ano Letivo: 2026 | Emissão: ${new Date().toLocaleDateString('pt-BR')}`, margin + 6, y + 20);

  y += 28;

  // Summary Metrics Banner
  doc.setFillColor(254, 243, 199); // Warm amber
  doc.rect(margin, y, pageWidth - (margin * 2), 12, 'F');
  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);

  const total = books.length;
  const disponiveis = books.filter(b => b.disponivel === 'Sim').length;
  const emprestados = total - disponiveis;
  const atrasados = loans.filter(l => l.status === 'atrasado').length;

  doc.text(`Total no Acervo: ${total} títulos  |  Disponíveis: ${disponiveis}  |  Emprestados: ${emprestados}  |  Devoluções Atrasadas: ${atrasados}`, margin + 4, y + 8);

  y += 16;

  // Table Header
  doc.setFillColor(243, 244, 246);
  doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  doc.text('Nº Tombo', margin + 2, y + 5);
  doc.text('Título da Obra', margin + 20, y + 5);
  doc.text('Autor', margin + 90, y + 5);
  doc.text('Estante', margin + 145, y + 5);
  doc.text('Disp.', margin + 168, y + 5);

  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  for (let i = 0; i < books.length; i++) {
    const b = books[i];

    if (y > pageHeight - 18) {
      // Add page
      doc.addPage();
      y = margin;

      // Table Header on new page
      doc.setFillColor(243, 244, 246);
      doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
      doc.setTextColor(31, 41, 55);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('Nº Tombo', margin + 2, y + 5);
      doc.text('Título da Obra', margin + 20, y + 5);
      doc.text('Autor', margin + 90, y + 5);
      doc.text('Estante', margin + 145, y + 5);
      doc.text('Disp.', margin + 168, y + 5);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
    }

    // Row alternating background
    if (i % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y - 1, pageWidth - (margin * 2), 6, 'F');
    }

    doc.setTextColor(55, 65, 81);
    doc.text(b.tombo, margin + 2, y + 3.5);

    // Truncate title if long
    const shortTitle = b.titulo.length > 42 ? b.titulo.substring(0, 40) + '...' : b.titulo;
    doc.text(shortTitle, margin + 20, y + 3.5);

    const shortAuthor = b.autor.length > 28 ? b.autor.substring(0, 26) + '...' : b.autor;
    doc.text(shortAuthor, margin + 90, y + 3.5);

    doc.text(b.estante, margin + 147, y + 3.5);

    if (b.disponivel === 'Sim') {
      doc.setTextColor(16, 185, 129);
      doc.text('Sim', margin + 168, y + 3.5);
    } else {
      doc.setTextColor(239, 68, 68);
      doc.text('Não', margin + 168, y + 3.5);
    }

    y += 6;
  }

  // Footer stamp
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Biblioteca Valdiva Colaço - EMEF Desembargador Pedro de Queiroz | Página ${p} de ${totalPages} | Sistema de Cadastro 2026`,
      margin,
      pageHeight - 8
    );
  }

  doc.save(`relatorio_oficial_acervo_valdiva_colaco_${new Date().toISOString().slice(0, 10)}.pdf`);
}
