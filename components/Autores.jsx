import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '../public/logo.svg'

export const Autores = () => {
    //Importação das Imagens
    var LogoIF = require('../public/ifms-dr-marca-2015.png');
    var LogoEmbrapa = require('../public/logo-embrapa-400.png');
    var LogoIFEmbrapa = require('../public/logo-if-embrapa.png');

    //Fetch para pegar os dados da api Autors criada no Strapi
    const [data, setData] = useState([]);
    useEffect(() => {
        CarregaAutores();
        document.title = 'Embrapa Autores';
    }, []);

    const CarregaAutores = async () => {
        const url = 'https://api-cartilha.onrender.com/api/autors?populate=*';
        try {
            const response = await fetch(url);
            if (response.ok) {
                const json = await response.json();
                const data = json.data;
                // Ordenar os autores por ID (do menor para o maior)
                const sortedData = data.sort((a, b) => a.id - b.id);
                
                console.log('API response:', sortedData);
                setData(sortedData);
            } else {
                throw new Error('Falha na requisição. Código de status: ' + response.status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return(
        <>
            <Head>
                <meta name="referrer" referrerPolicy="no-referrer" />
                <title>Embrapa</title>
            </Head>
            
            {/* Código Navbar Offcanvas */}
            <div className="container-autors">
            <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top" aria-label="Offcanvas navbar large">
                <div className="container-fluid">
                    <div className="d-flex align-items-center"> 
                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar2" aria-controls="offcanvasNavbar2">
                            <i className="fas fa-bars"></i>
                        </button>
                        {/* Logo Navbar */}
                        <Link className="navbar-brand" href="/home">
                            <Image src={Logo} width={350} height={54} alt="logo Embrapa com letras em azul com um simbolo verde, sendo que as letras em cima do simbolo são brancas"/>
                        </Link>
                    </div>
                    {/* Input Search para tela menor que 992px */}
                    <div className="first-form-search">
                        <form className="d-flex rounded-pill p-1 position-relative first-form-search" role="search">
                            <div className="input-group">
                                <input
                                    className="form-control border-0 rounded-pill pr-5"
                                    type="search"
                                    placeholder="Buscar"
                                    aria-label="Search"
                                />
                                <div className="input-group-append">
                                    <span className="">
                                        <i className="fas fa-search icone-search"></i>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Código dos Itens Exibidos no Navbar */}
                    <div className="offcanvas offcanvas-start text-bg-light" tabIndex="-1" id="offcanvasNavbar2" aria-labelledby="offcanvasNavbar2Label">
                        <div className="offcanvas-header">
                            <ul className="navbar-nav d-flex links-logo-ifembrapa flex-row mx-1">
                                {/* Logo IF / Embrapa Dentro do Menu */}
                                <li className="nav-item">
                                    <Link href="/home">
                                        <Image src={LogoIFEmbrapa} className='img-navbar-menu me-3' width="100%" height={46} alt="logo Embrapa com letras em azul com um simbolo verde, sendo que as letras em cima do simbolo são brancas" priority/>
                                    </Link>
                                </li>
                            </ul>
                            <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <hr className="featurette-divider"></hr>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end flex-grow-1 center-itens">
                                <li className="nav-item">
                                    <Link className="nav-link back-item-link" href="/edicao-completa" aria-current="page">
                                        <span className="link-text">Edição Completa</span>
                                    </Link>     
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link back-item-link" href="/autores" aria-current="page">
                                        <span className="link-text">Autores</span>
                                    </Link>
                                </li>
                            </ul>
                            {/* Input Search para tela maior que 992px */}
                            <form id="searchForm" className="d-flex rounded-pill p-1 position-relative" role="search">
                                <div className="input-group">
                                    <input
                                        className="form-control border-0 rounded-pill pr-5"
                                        type="search"
                                        placeholder="Buscar"
                                        aria-label="Search"
                                    />
                                    <div className="input-group-append">
                                        <span className="">
                                            <i className="fas fa-search icone-search"></i>
                                        </span>
                                    </div>
                                </div>
                            </form>
                            <ul className="navbar-nav d-flex links-logo flex-row">
                                <li className="nav-item second-logo-inst">
                                    <Image src={LogoIF} className='logotipo me-3' width="100%" height={32} alt="Logotiopo do IFMS Campus Dourados" priority/>
                                </li>
                                <li className="nav-item second-logo-inst">
                                    <Image src={LogoEmbrapa} className='logotipo' width="100%" height={48} alt="Logotiopo da Embrapa" priority/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Conteúdos dos Autores */}
            <div className="showcaseSection">
                <div className="headerTitle">
                    <h1>Autores</h1>
                </div>
                {/* Código dos Card dos Autores */}
                <div className="main-container-cards container-cards">
                {/* Puxando os Dados do Fetch */}
                {data.length > 0 ? (
                    data.map((item) => {
                        // Fazer o parse da propriedade description que está em JSON
                        const descriptionData = JSON.parse(item.attributes.description);

                        // Obter a URL da imagem
                        const imageUrl = descriptionData.blocks[0].data.file.url;

                        // Obter a descrição
                        const description = descriptionData.blocks.find(block => block.type === 'paragraph')?.data?.text || 'Descrição não disponível';

                        // Obter a URL
                        const lattesLinkBlock = descriptionData.blocks.find(
                            (block) => block.type === 'paragraph' && block.data.text.includes('Currículo Lattes')
                        );

                        let lattesUrl = '';
                            if (lattesLinkBlock) {
                            const linkRegex = /href="([^"]+)"/; // Regex para extrair o valor do atributo href
                            const match = lattesLinkBlock.data.text.match(linkRegex);
                            if (match && match[1]) {
                                lattesUrl = match[1];
                            }
                        }

                        return (
                        <div key={item.id} className="card">
                            <div className="containerAutor_v1t1">
                            {/* Imagem dos Autores */}
                                <div className="containerFoto_oz_I">
                                    <img src={imageUrl} alt="Foto dos Autores" width="100%" />
                                </div>
                                {/* Nome dos Autores */}
                                <p className="bold nome-autor">{item.attributes.name}</p>
                            </div>
                            {/* Descrição dos Autores */}
                            <div className="cardContainer_HEVx">
                                <p className="descricao-autor">{description}</p>
                            </div>
                            {/* Link para o Currículo dos Autores */}
                            <div className="action-card">
                                <a target="_blank" href={lattesUrl}>Currículo Lattes</a>
                            </div>
                        </div>
                        );
                    })
                    ) : (
                    <p>Carregando dados...</p>
                    )}
                </div>
            </div>
            </div>

            {/* Código Footer Embrapa */}    
            <footer>
                <div className="container container-footer bottom-0 end-0">
                    <div className="title-footer">
                        <p>Embrapa Agropecuária Oeste</p>
                    </div>
                    <div className="description-footer">
                        <p>Rodovia BR 163, Km 253,6, Caixa Postal 449, CEP: 79804-970, Dourados, MS</p>
                        <p>Fone: + 55 (67) 3416-9700</p>
                    </div>
                </div>
            </footer>   
        </>
    );
};
