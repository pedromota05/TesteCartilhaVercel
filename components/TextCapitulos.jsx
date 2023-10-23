import { useState, useEffect, useRef } from 'react';
import TableOfContents from './TableOfContents';

const TextCapitulos = ({ lista, activeTitle, setActiveTitle }) => {
  const [headerBlocks, setHeaderBlocks] = useState([]);
  const [references, setReferences] = useState([]);

  useEffect(() => {
    const extractedHeaderBlocks = [];
    const extractedReferences = [];

    lista.forEach((cap) => {
      const blocks = JSON.parse(cap.attributes.description).blocks;
      const refs = cap.attributes.referencias; // Assuming referencias is an array

      if (refs && refs.length > 0) {
        const refBlocks = JSON.parse(refs[0].description).blocks;
        extractedReferences.push(refBlocks);

        console.log(refBlocks);
      }
      blocks.forEach((block) => {
        if (block.type === 'header') {
          extractedHeaderBlocks.push(block);
        }
      });
    });
    setHeaderBlocks(extractedHeaderBlocks);
    setReferences(extractedReferences);
    console.log("headerBlocks:", extractedHeaderBlocks);
  }, [lista]);
  

  function convertToHTML(data) {
    let htmlContent = ''; // Variável para armazenar o conteúdo HTML

    data.blocks.forEach((block) => {
      switch (block.type) {
        case 'header':
          const anchor = block.data.text.replace(/ /g, "_"); // Criar âncora
          htmlContent += `<h${block.data.level} class="titulo" id='${anchor}'>${block.data.text}</h${block.data.level}>`;
          break;
        case 'paragraph':

          // Se não estivermos no bloco de instituição, adicione o conteúdo normal com a classe "paragrafo"
          htmlContent += `<p class="paragrafo">${block.data.text}</p>`;
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
          // const anchor1 = block.data.text.replace(/ /g, "_"); // Criar âncora
          // htmlContent += `<h${block.data.level} class="titulo" id='${anchor}'>${block.data.text}</h${block.data.level}>`;
          break;
      }
    });
    return htmlContent;
  }

  function RefconvertToHTML(data) {
    let htmlContent = ''; // Variável para armazenar o conteúdo HTML
    htmlContent += `<h3>Instituição</h3>`
    htmlContent += `<div class='instituicao'>`
    data.blocks.forEach((block) => {
      switch (block.type) {
        case 'header':
          const anchor = block.data.text.replace(/ /g, "_"); // Criar âncora
          htmlContent += `<h${block.data.level} class="nome-instituicao" id='${anchor}'>${block.data.text}</h${block.data.level}>`;
          break;
        case 'paragraph':
          htmlContent += `<p class="paragrafo">${block.data.text}</p>`;
          break;
        default:
          // const anchor1 = block.data.text.replace(/ /g, "_"); // Criar âncora
          // htmlContent += `<h${block.data.level} class="titulo" id='${anchor}'>${block.data.text}</h${block.data.level}>`;
          break;
      }
    });
    htmlContent += `</div>`
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
                {/* <h3>Instituição</h3> */}
                 {/* Adicione esta seção para exibir as referências */}
                 {activeTitle === cap.id && references.length > 0 && (
                  <div className="references">
                    {/* <h3>Instituição</h3>  */}
                    <h2>{references[0].title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: RefconvertToHTML({ blocks: references[0] }) }} />
                    {console.log("info das ref", references)}
                  </div>
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
