document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-button');
    const animeCards = document.querySelectorAll('.anime-card');
    const animeGrid = document.getElementById('anime-grid');
    const logo = document.querySelector('.logo');
    
    const counterDiv = document.createElement('div');
    counterDiv.className = 'anime-counter';
    counterDiv.style.textAlign = 'center';
    counterDiv.style.margin = '1rem 0';
    counterDiv.style.color = 'var(--text-soft-color)';
    document.querySelector('.controls-container').appendChild(counterDiv);

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            themeToggle.textContent = '🌙';
        }
    };
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    const filterAndSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeGenre = document.querySelector('.filter-button.active').dataset.genre;
        let visibleCount = 0;

        animeCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const genres = card.dataset.genre.split(',');
            
            const genreMatch = activeGenre === 'all' || genres.includes(activeGenre);
            const searchMatch = !searchTerm || title.includes(searchTerm);

            if (genreMatch && searchMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
            
            if (!searchTerm) {
                card.classList.remove('highlighted');
            }
        });

        counterDiv.textContent = `Showing ${visibleCount} anime${visibleCount !== 1 ? 's' : ''}`;
        
        counterDiv.style.animation = 'pulse 0.5s ease';
    };
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterAndSearch();
        });
    });

    searchInput.addEventListener('input', () => {
        filterAndSearch();
        const searchTerm = searchInput.value.toLowerCase().trim();
        let firstMatchElement = null;

        animeCards.forEach(card => {
            const title = card.dataset.title.toLowerCase();
            const isMatch = searchTerm && title.includes(searchTerm);

            if (isMatch) {
                card.classList.add('highlighted');
                if (!firstMatchElement) {
                    firstMatchElement = card;
                }
            } else {
                card.classList.remove('highlighted');
            }

            card.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (formModal.style.display === 'flex') return; 
                
                const title = card.querySelector('h4').textContent;
                const img = card.querySelector('img').src;
                const genres = card.dataset.genre.split(',');
                
                const genreText = genres.map(g => 
                    g.charAt(0).toUpperCase() + g.slice(1)
                ).join(' & ');
                
                const description = `${title} is a ${genreText} anime series.`;
                
                document.getElementById('modal-img').src = img;
                document.getElementById('modal-title').textContent = title;
                document.getElementById('modal-description').textContent = description;
                
                const modal = document.getElementById('modal-container');
                modal.style.display = 'flex';
                setTimeout(() => modal.style.opacity = '1', 10);
            };
        });

        if (firstMatchElement) {
            firstMatchElement.scrollIntoView({
                behavior: 'smooth', 
                block: 'center',   
                inline: 'nearest' 
            });
        }
        
        filterAndSearch();
    });

    const backToTopButton = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    
    animeCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h4').textContent;
            const img = card.querySelector('img').src;
            
            document.getElementById('modal-img').src = img;
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-description').textContent = 
                `${title} is a ${card.dataset.genre.split(',').join(' & ')} anime series.`;
            
            const modal = document.getElementById('modal-container');
            modal.style.display = 'flex';
            setTimeout(() => modal.style.opacity = '1', 10);
        });
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        const modal = document.getElementById('modal-container');
        modal.style.opacity = '0';
        setTimeout(() => modal.style.display = 'none', 300);
    });

    logo.addEventListener('mouseenter', () => {
        logo.style.transform = 'scale(1.1)';
        logo.style.transition = 'transform 0.3s ease';
    });

    logo.addEventListener('mouseleave', () => {
        logo.style.transform = 'scale(1)';
    });

    filterButtons.forEach(button => {
        button.addEventListener('dblclick', () => {
            const genre = button.dataset.genre;
            const count = genre === 'all' 
                ? animeCards.length 
                : Array.from(animeCards).filter(card => 
                    card.dataset.genre.split(',').includes(genre)
                ).length;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = `${count} anime${count !== 1 ? 's' : ''} in ${genre}`;
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'var(--accent-color)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '0.5rem 1rem';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '0.8rem';
            tooltip.style.zIndex = '1000';
            
            const rect = button.getBoundingClientRect();
            tooltip.style.top = rect.top - 40 + 'px';
            tooltip.style.left = rect.left + (rect.width - 100)/2 + 'px';
            
            document.body.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 300);
            }, 2000);
        });
    });

    const formModal = document.getElementById('form-modal');
    const closeFormButton = document.querySelector('.close-form');
    const animeForm = document.getElementById('anime-form');
    const errorPopup = document.getElementById('error-popup');
    const errorMessage = document.getElementById('error-message');
    const errorClose = document.querySelector('.error-close');
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('anime-rating');
    const reviewTextarea = document.getElementById('anime-review');
    const characterCount = document.querySelector('.character-count');

    function updateStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            star.classList.toggle('active', starRating <= rating);
        });
    }


    formModal.style.display = 'none';
    formModal.style.opacity = '0';
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            ratingInput.value = rating;
            updateStars(rating);
        });

        star.addEventListener('mouseover', () => {
            const rating = parseInt(star.dataset.rating);
            updateStars(rating);
        });
    });

    document.querySelector('.star-rating').addEventListener('mouseleave', () => {
        updateStars(ratingInput.value || 0);
    });

    ratingInput.addEventListener('input', () => {
        const value = parseInt(ratingInput.value);
        if (value >= 1 && value <= 10) {
            updateStars(value);
        }
    });

    reviewTextarea.addEventListener('input', () => {
        const length = reviewTextarea.value.length;
        characterCount.textContent = `${length}/500`;
        characterCount.style.color = length > 450 ? '#ef4444' : 'var(--text-soft-color)';
    });

    closeFormButton.addEventListener('click', () => {
        formModal.style.opacity = '0';
        setTimeout(() => {
            formModal.style.display = 'none';
            resetForm();
            
            const detailModal = document.getElementById('modal-container');
            detailModal.style.display = 'flex';
            setTimeout(() => detailModal.style.opacity = '1', 10);
        }, 300);
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        const detailModal = document.getElementById('modal-container');
        detailModal.style.opacity = '0';
        setTimeout(() => {
            detailModal.style.display = 'none';
            resetForm(); 
        }, 300);
    });

    errorClose.addEventListener('click', () => {
        errorPopup.style.opacity = '0';
        setTimeout(() => errorPopup.style.display = 'none', 300);
    });

    document.getElementById('rate-anime').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const detailModal = document.getElementById('modal-container');
        const formModal = document.getElementById('form-modal');
        const img = document.getElementById('modal-img').src;
        const title = document.getElementById('modal-title').textContent;

        detailModal.style.opacity = '0';
        setTimeout(() => {
            detailModal.style.display = 'none';
            
            resetForm();
            document.getElementById('selected-anime-img').src = img;
            document.getElementById('selected-anime-title').textContent = title;
            
            formModal.style.display = 'flex';
            setTimeout(() => formModal.style.opacity = '1', 10);
        }, 300);
    });

    function resetForm() {
        animeForm.reset();
        updateStars(0);
        characterCount.textContent = '0/500';
        characterCount.style.color = 'var(--text-soft-color)';
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
            group.querySelector('.error-message').textContent = '';
        });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorPopup.style.display = 'flex';
        setTimeout(() => errorPopup.style.opacity = '1', 10);
    }

    function showSuccess(message) {
        errorMessage.textContent = message;
        errorPopup.style.display = 'flex';
        setTimeout(() => errorPopup.style.opacity = '1', 10);
        
        setTimeout(() => {
            errorPopup.style.opacity = '0';
            setTimeout(() => errorPopup.style.display = 'none', 300);
        }, 2000);
    }

    function validateField(field, errorElement) {
        const value = field.value.trim();
        let error = '';

        if (field.required && !value) {
            error = 'This field is required';
        } else if (field.id === 'anime-rating') {
            const rating = Number(value);
            if (isNaN(rating) || rating < 1 || rating > 10) {
                error = 'Rating must be between 1 and 10';
            }
        } else if (field.id === 'anime-review') {
            if (value.length < 10) {
                error = 'Review must be at least 10 characters long';
            } else if (value.length > 500) {
                error = 'Review cannot exceed 500 characters';
            }
        }

        const formGroup = field.closest('.form-group');
        if (error) {
            formGroup.classList.add('error');
            errorElement.textContent = error;
            return false;
        } else {
            formGroup.classList.remove('error');
            errorElement.textContent = '';
            return true;
        }
    }

    animeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        document.querySelectorAll('.form-group').forEach(group => {
            const field = group.querySelector('input, textarea');
            const errorElement = group.querySelector('.error-message');
            if (!validateField(field, errorElement)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showError('Please correct the errors in the form.');
            return;
        }

        const animeTitle = document.getElementById('selected-anime-title').textContent;
        
        showSuccess(`Thank you for rating ${animeTitle}!`);
        
        formModal.style.opacity = '0';
        setTimeout(() => {
            formModal.style.display = 'none';
            resetForm();
        }, 300);
    });

    document.querySelectorAll('.form-group input, .form-group textarea')
        .forEach(field => {
            field.addEventListener('input', () => {
                const errorElement = field.closest('.form-group').querySelector('.error-message');
                validateField(field, errorElement);
            });
        });
});
