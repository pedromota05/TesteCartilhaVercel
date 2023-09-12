import { useState, useEffect, useRef } from 'react';
import TableOfContents from './TableOfContents';

const TextCapitulos = ({lista, activeTitle, setActiveTitle}) => {
  const [headerBlocks, setHeaderBlocks] = useState([]);

  useEffect(() => {
    const extractedHeaderBlocks = [];
    lista.forEach((cap) => {
      const blocks = JSON.parse(cap.attributes.description).blocks;
      blocks.forEach((block) => {
        if (block.type === 'header') {
          extractedHeaderBlocks.push(block);
        }
      });
    });
    setHeaderBlocks(extractedHeaderBlocks);
    console.log("headerBlocks:", extractedHeaderBlocks);
  }, [lista]);

  function convertToHTML(data) {
    let htmlContent = ''; // Variável para armazenar o conteúdo HTML
    let isInstituicao = false;
    let isInsideEmbrapaMilhoESorgo = false;
    
    data.blocks.forEach((block) => {
      switch (block.type) {
        case 'header':
          const anchor = block.data.text.replace(/ /g, "_"); // Criar âncora
          htmlContent += `<h${block.data.level} class="titulo" id='${anchor}'>${block.data.text}</h${block.data.level}>`;
          break;
          case 'paragraph':
            if (block.data.text.includes("Embrapa Gado de Leite")) {
              // Se encontrarmos o início do bloco de instituição, defina isInstituicao como verdadeiro
              isInstituicao = true;
              htmlContent += `<div class="instituicao">`;
              htmlContent += `<p class="nome-instituicao">${block.data.text}</p>`;
            }
            else if (block.data.text.includes("Embrapa Agropecuária Oeste")) {
              // Se encontrarmos o início do bloco de instituição, defina isInstituicao como verdadeiro
              isInstituicao = true;
              htmlContent += `<div class="instituicao">`;
              htmlContent += `<p class="nome-instituicao">${block.data.text}</p>`;
            } 
            else if (block.data.text.includes("Agência de Desenvolvimento Agrário e Extensão Rural (Agraer)")) {
              // Se encontrarmos o início do bloco de instituição, defina isInstituicao como verdadeiro
              isInstituicao = true;
              htmlContent += `<div class="instituicao">`;
              htmlContent += `<p class="nome-instituicao">${block.data.text}</p>`;
            } 
            else if (block.data.text.includes("Universidade Federal da Grande Dourados (UFGD)")) {
              // Se encontrarmos o início do bloco de instituição, defina isInstituicao como verdadeiro
              isInstituicao = true;
              htmlContent += `<div class="instituicao">`;
              htmlContent += `<p class="nome-instituicao">${block.data.text}</p>`;
            }
            else if (block.data.text.includes("Embrapa Milho e Sorgo")) {
              // Se encontrarmos o início do bloco de instituição, defina isInstituicao como verdadeiro
              isInstituicao = true;
              htmlContent += `<div class="instituicao">`;
              htmlContent += `<p class="nome-instituicao">${block.data.text}</p>`;
            } 
            else if (block.data.text.includes("Embrapa Hortaliças")) {
              // Se encontrarmos o início do bloco de instituição, defina isInstituicao como verdadeiro
              isInstituicao = true;
              htmlContent += `<div class="instituicao">`;
              htmlContent += `<p class="nome-instituicao">${block.data.text}</p>`;
            } 
            else if (isInstituicao) {
              const parts = block.data.text.split('Site institucional:');
              const parts1 = block.data.text.split('Fone:');
              const parts2 = block.data.text.split('Local:');
              if (parts.length === 2) {
                // Se houver dois pontos, aplique a formatação desejada
                const boldText = parts[0].trim();
                const normalText = parts[1].trim();
                htmlContent += `<p><strong>${boldText}Site institucional:</strong> ${normalText}</p>`;
              } 
              else if (parts1.length === 2) {
                // Se houver dois pontos, aplique a formatação desejada
                const boldText = parts1[0].trim();
                const normalText = parts1[1].trim();
                htmlContent += `<p><strong>${boldText}Fone:</strong> ${normalText}</p>`;
              } 
              else if (parts2.length === 2) {
                // Se houver dois pontos, aplique a formatação desejada
                const boldText = parts2[0].trim();
                const normalText = parts2[1].trim();
                htmlContent += `<p><strong>${boldText}Local:</strong> ${normalText}</p>`;
              } 
              else {
                // Se não houver dois pontos, adicione o conteúdo normal com a classe "paragrafo"
                htmlContent += `<p class="paragrafo">${block.data.text}</p>`;
              }
            } else {
              // Se não estivermos no bloco de instituição, adicione o conteúdo normal com a classe "paragrafo"
              htmlContent += `<p class="paragrafo">${block.data.text}</p>`;
            }
            
            // Verifique se o bloco de instituição foi fechado
            if (isInstituicao && block.data.text.includes("Local:Dourados, MS")) {
              htmlContent += `</div>`; // Feche a div do bloco de instituição
              isInstituicao = false; // Redefina isInstituicao
            } else if (isInstituicao && block.data.text.includes("Local: Juiz de Fora, MG")) {
              htmlContent += `</div>`; // Feche a div do bloco de instituição
              isInstituicao = false; // Redefina isInstituicao
            } else if (isInstituicao && block.data.text.includes("Local:Campo Grande, MS")) {
              htmlContent += `</div>`; // Feche a div do bloco de instituição
              isInstituicao = false; // Redefina isInstituicao
            } else if (isInstituicao && block.data.text.includes("Local:Sete Lagoas, MG")) {
              htmlContent += `</div>`; // Feche a div do bloco de instituição
              isInstituicao = false; // Redefina isInstituicao
            }
            else if (isInstituicao && block.data.text.includes("Local:Brasília, DF")) {
              htmlContent += `</div>`; // Feche a div do bloco de instituição
              isInstituicao = false; // Redefina isInstituicao
            }
            break;
        case 'list':
          const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
          let listItemsHTML = '';
          block.data.items.forEach((item) => {
            listItemsHTML += `<li>${item}</li>`;
          });
          htmlContent += `<${listType} class="lista">${listItemsHTML}</${listType}>`;
          break;
         case 'image':
            // Use a URL do Cloudinary fornecida no bloco de dados
            const imageSrc = block.data.file.url;
            const imageCaption = block.data.caption;
  
            // Crie o elemento de imagem com a URL do Cloudinary
            htmlContent += `<img src="${imageSrc}" alt="${imageCaption}" />`;
            htmlContent += `<p class="legenda-img">${imageCaption}</p>`;
            break;
          case 'embed':
            const videoUrl = new URL(block.data.source);
            const videoId = videoUrl.pathname.substring(1); // Remove a barra inicial
            const videoCaption = block.data.caption;
            const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
              htmlContent +=
                ` <div id="player">
                    <div class="html5-video-player">
                      <iframe
                        width="100%"
                        height="315"
                        src=${videoEmbedUrl}
                        frameBorder="0"
                        allowFullscreen
                      >
                      </iframe>
                    </div>
                  </div>`
            break;
          // Adicione outros casos para outros tipos de blocos do Editor.js, se necessário.
          default:
            break;
      }
    });
    return htmlContent;
  }
  const chapterRefs = useRef({}); // Use useRef para armazenar referências a elementos de capítulo
  const currentIndex = lista.findIndex((cap) => cap.id === activeTitle);
  const prevChapter = lista[currentIndex - 1];
  const nextChapter = lista[currentIndex + 1];

  const handleNavigation = (chapterId) => {
    setActiveTitle(chapterId);
    scrollToTop();
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Adicionando um efeito de rolagem suave
    });
  };

  return (
    <>
      <div className="text-with-toc">
        <div className="text-content">
          <article className='article'>
            {lista.map((cap) => (
              <div key={cap.id} className="bd-content ps-lg-2" ref={(el) => (chapterRefs.current[cap.id] = el)}>
                {activeTitle === cap.id && (
                  <h1>{cap.attributes.title}</h1>
                )}
                {activeTitle === cap.id && (
                  <div className='center-textArticle'>{cap.attributes.subtitle}</div>
                )}
                {activeTitle === cap.id && (
                  <div dangerouslySetInnerHTML={{ __html: convertToHTML(JSON.parse(cap.attributes.description)) }} />
                )}
              </div>
            ))}
          </article>
        </div>
        <div className="table-of-contents">
          <TableOfContents key={activeTitle} headerBlocks={headerBlocks} />
        </div>
      </div>
      <nav className="pagination-nav docusaurus-mt-lg" aria-label="Páginas de documentação" style={{ zIndex: 99999 }}>
        {prevChapter && (
          <button
            className="pagination-nav__link pagination-nav__link--prev"
            onClick={() => handleNavigation(prevChapter.id)}
          >
            <div className="pagination-nav__sublabel">Anterior</div>
            <div className="pagination-nav__label">{prevChapter.attributes.title}</div>
          </button>
        )}
        {nextChapter && (
          <button
            className="pagination-nav__link pagination-nav__link--next"
            onClick={() => handleNavigation(nextChapter.id)}
          >
            <div className="pagination-nav__sublabel">Próxima</div>
            <div className="pagination-nav__label">{nextChapter.attributes.title}</div>
          </button>
        )}
      </nav>
    </>
  );
};

export default TextCapitulos;
