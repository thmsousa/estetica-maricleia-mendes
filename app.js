/* ==========================================================================
   LÓGICA E INTERAÇÕES - ESTÉTICA MARICLEIA MENDES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa ícones Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ----------------------------------------------------
       1. CONTROLE DO HEADER AO ROLAR A PÁGINA (SCROLL)
       ---------------------------------------------------- */
    const header = document.getElementById('header');
    
    const checkScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Executa ao iniciar para o caso de recarregar com scroll ativado

    /* ----------------------------------------------------
       2. MENU RESPONSIVO (HAMBÚRGUER)
       ---------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        header.classList.toggle('menu-open');
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        header.classList.remove('menu-open');
    };

    hamburger.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    /* ----------------------------------------------------
       3. ANIMAÇÃO DE REVELAÇÃO AO ROLAR (SCROLL REVEAL)
       ---------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Deixa de observar o elemento após a animação inicial para melhor performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // ativa quando 15% do elemento estiver visível
        rootMargin: "0px 0px -50px 0px" // ativa levemente antes de entrar totalmente na tela
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ----------------------------------------------------
       4. CARROSSEL DE DEPOIMENTOS (SLIDER)
       ---------------------------------------------------- */
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const slides = Array.from(track.children);
    
    let currentIndex = 0;
    let autoSlideInterval;

    const updateSlider = (index) => {
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    const nextSlide = () => {
        updateSlider(currentIndex + 1);
    };

    const prevSlide = () => {
        updateSlider(currentIndex - 1);
    };

    // Eventos dos botões
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    // Auto-scroll a cada 7 segundos
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, 7000);
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    startAutoSlide();

    /* ----------------------------------------------------
       5. SLIDER INTERATIVO ANTES / DEPOIS
       ---------------------------------------------------- */
    const container = document.getElementById('comparison-slider-container');
    const afterImg = document.getElementById('comparison-after-img');
    const sliderBar = document.getElementById('comparison-slider-bar');
    const sliderButton = document.getElementById('comparison-slider-button');
    
    let isDragging = false;

    if (container && afterImg && sliderBar && sliderButton) {
        const updateSliderPosition = (xPos) => {
            const rect = container.getBoundingClientRect();
            // Calcula o deslocamento em relação à largura do container (como porcentagem)
            let percentage = ((xPos - rect.left) / rect.width) * 100;
            
            // Limita os valores entre 0% e 100%
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;
            
            // Aplica a largura correta para revelar a imagem superior (Antes) a partir da esquerda
            afterImg.style.width = `${percentage}%`;
            sliderBar.style.left = `${percentage}%`;
            
            // Ajusta o tamanho da imagem interna em pixels reais para manter a escala e evitar deformações
            const img = afterImg.querySelector('img');
            if (img) {
                img.style.width = `${rect.width}px`;
            }
        };

        const initSlider = () => {
            const rect = container.getBoundingClientRect();
            afterImg.style.width = '50%';
            sliderBar.style.left = '50%';
            const img = afterImg.querySelector('img');
            if (img) {
                img.style.width = `${rect.width}px`;
            }
        };

        // Executa inicialização no carregamento e no redimensionamento de janela
        initSlider();
        window.addEventListener('resize', initSlider);

        // Eventos de Mouse
        sliderButton.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSliderPosition(e.clientX);
        });

        // Eventos de Toque (Dispositivos Móveis)
        sliderButton.addEventListener('touchstart', (e) => {
            isDragging = true;
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches.length > 0) {
                updateSliderPosition(e.touches[0].clientX);
            }
        });

        // Suporte para cliques diretos na área de comparação
        container.addEventListener('click', (e) => {
            if (e.target !== sliderButton && !sliderButton.contains(e.target)) {
                updateSliderPosition(e.clientX);
            }
        });
    }

    /* ----------------------------------------------------
       6. BASE DE DADOS DOS SERVIÇOS E CONTROLE DO MODAL
       ---------------------------------------------------- */
    const servicesData = {
        'limpeza-pele': {
            category: 'Facial',
            title: 'Limpeza de Pele Profunda',
            img: 'assets/service_facials.png',
            desc: 'A Limpeza de Pele Profunda é essencial para manter a saúde e beleza da face. O procedimento remove comedões (cravos), impurezas causadas pela poluição, maquiagem acumulada e células mortas, estimulando a renovação celular natural.',
            benefits: [
                'Prevenção e controle de acne',
                'Desobstrução dos poros',
                'Extração segura de cravos e miliuns',
                'Melhora na oxigenação e nutrição da pele',
                'Textura macia e viço imediato'
            ],
            price: 'A partir de R$ 130'
        },
        'peeling': {
            category: 'Facial',
            title: 'Peeling Facial Renovador',
            img: 'assets/skin_glow.png',
            desc: 'O Peeling é um tratamento focado na esfoliação profunda da pele, que pode ser física (Diamante) ou química (Ácidos controlados). Promove a descamação suave da camada externa, dando lugar a uma pele nova, firme e uniforme.',
            benefits: [
                'Atenuação de manchas e melasma',
                'Redução de cicatrizes de acne',
                'Estímulo de colágeno e firmeza',
                'Suavização de rugas finas',
                'Uniformização do tom da pele'
            ],
            price: 'Sob Avaliação'
        },
        'massagem': {
            category: 'Corporal',
            title: 'Massagem Modeladora & Drenagem',
            img: 'assets/service_body.png',
            desc: 'A união de duas técnicas poderosas para a remodelagem corporal. A massagem modeladora foca em áreas de gordura localizada com manobras firmes e ritmo acelerado, enquanto a drenagem linfática reduz a retenção de líquidos e elimina toxinas.',
            benefits: [
                'Redução de medidas corporais',
                'Combate ao inchaço e celulite',
                'Melhora na circulação sanguínea',
                'Modelagem de silhueta (abdômen, pernas, glúteos)',
                'Sensação de leveza e relaxamento profundo'
            ],
            price: 'A partir de R$ 90 / sessão'
        }
    };

    const modal = document.getElementById('service-modal');
    const modalClose = document.getElementById('modal-close-btn');
    const modalImg = document.getElementById('modal-img');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalBenefitsList = document.getElementById('modal-benefits-list');
    const modalPrice = document.getElementById('modal-price');
    const modalCta = document.getElementById('modal-cta-btn');

    const openServiceModal = (serviceKey) => {
        const data = servicesData[serviceKey];
        if (!data) return;

        // Preenche o modal com as informações correspondentes
        modalImg.style.backgroundImage = `url('${data.img}')`;
        modalCategory.textContent = data.category;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modalPrice.textContent = data.price;

        // Limpa e recria a lista de benefícios
        modalBenefitsList.innerHTML = '';
        data.benefits.forEach(benefit => {
            const li = document.createElement('li');
            li.innerHTML = `<i data-lucide="check" style="width: 16px; height: 16px;"></i> ${benefit}`;
            modalBenefitsList.appendChild(li);
        });

        // Recria ícones Lucide no modal para garantir renderização correta
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Configura link do WhatsApp no modal
        const messageText = encodeURIComponent(`Olá Maricleia! Gostaria de saber mais e agendar o procedimento de: ${data.title}.`);
        modalCta.href = `https://wa.me/5563992636266?text=${messageText}`;

        // Abre o modal com classe ativa
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // impede rolagem ao fundo do modal
    };

    const closeServiceModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // restabelece rolagem
    };

    // Eventos nos botões do Grid de Serviços
    const modalTriggers = document.querySelectorAll('.btn-modal, .footer-links a[data-service]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceKey = trigger.getAttribute('data-service');
            if (serviceKey) {
                openServiceModal(serviceKey);
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeServiceModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            // fecha o modal caso o clique tenha sido no background desfocado
            if (e.target === modal) {
                closeServiceModal();
            }
        });
    }

    // Tecla Esc para fechar o modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeServiceModal();
        }
    });

    /* ----------------------------------------------------
       7. PROCESSAMENTO E ENVIO DO FORMULÁRIO DE CONTATO
       ---------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const service = document.getElementById('form-service').value || 'Avaliação Geral / Outros';
            const message = document.getElementById('form-message').value;

            // Formata o texto da mensagem para envio no WhatsApp
            let waText = `Olá Maricleia Mendes! \n\n*Nova solicitação de contato via Landing Page* \n\n`;
            waText += `*Nome:* ${name}\n`;
            waText += `*WhatsApp:* ${phone}\n`;
            waText += `*Serviço de Interesse:* ${service}\n`;
            
            if (message.trim() !== '') {
                waText += `*Mensagem:* ${message}\n`;
            }
            
            // URL encode
            const waUrl = `https://wa.me/5563992636266?text=${encodeURIComponent(waText)}`;
            
            // Abre nova guia com o WhatsApp
            window.open(waUrl, '_blank');
            
            // Limpa o formulário após o envio
            contactForm.reset();
        });
    }
});
