// Bao bọc toàn bộ code để đảm bảo HTML load xong mới chạy JS
document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // 1. QUẢN LÝ DỮ LIỆU & LOCAL STORAGE
    // ==========================================
    const defaultDecks = [
        {
            id: "deck-daily",
            title: "Daily Life",
            image: "Suộc Ảnh/exam.jpg",
            cards: [
                { term: "Student", definition: "Học sinh, sinh viên" },
                { term: "Teacher", definition: "Giáo viên" },
                { term: "Wake up", definition: "Thức dậy" },
                { term: "Breakfast", definition: "Bữa sáng" },
                { term: "Homework", definition: "Bài tập về nhà" }
            ]
        },
        {
            id: "deck-schools",
            title: "Schools",
            image: "Suộc Ảnh/raisehands.jpg",
            cards: [
                { term: "Principal", definition: "Hiệu trưởng" },
                { term: "Classroom", definition: "Phòng học" },
                { term: "Library", definition: "Thư viện" },
                { term: "Uniform", definition: "Đồng phục" },
                { term: "Textbook", definition: "Sách giáo khoa" }
            ]
        },
        {
            id: "deck-extra",
            title: "Extracurricular Activities",
            image: "Suộc Ảnh/multitask.jpg",
            cards: [
                { term: "Club", definition: "Câu lạc bộ" },
                { term: "Volunteer", definition: "Tình nguyện viên" },
                { term: "Sport", definition: "Thể thao" },
                { term: "Music", definition: "Âm nhạc" },
                { term: "Workshop", definition: "Hội thảo" }
            ]
        },
        {
            id: "deck-exam",
            title: "Examination",
            image: "Suộc Ảnh/studentgroup.jpg",
            cards: [
                { term: "Test", definition: "Bài kiểm tra" },
                { term: "Score", definition: "Điểm số" },
                { term: "Final exam", definition: "Kì thi cuối kì" },
                { term: "Result", definition: "Kết quả" },
                { term: "Pass", definition: "Vượt qua (đỗ)" }
            ]
        }
    ];

    let savedDecks = localStorage.getItem("sb_decks");
    let decks;
    if (savedDecks !== null) {
        decks = JSON.parse(savedDecks);
    } else {
        decks = defaultDecks;
    }

    let activeDeckId = localStorage.getItem("sb_activeDeck");
    if (activeDeckId === null) {
        activeDeckId = "deck-schools";
    }

    let savedVocab = localStorage.getItem("sb_vocab");
    let vocabCount;
    if (savedVocab !== null) {
        vocabCount = parseInt(savedVocab); 
    } else {
        vocabCount = 5; 
    }

    let savedStreak = localStorage.getItem("sb_streak");
    let streakCount;
    if (savedStreak !== null) {
        streakCount = parseInt(savedStreak);
    } else {
        streakCount = 40; 
    }

    function saveData() {
        localStorage.setItem("sb_decks", JSON.stringify(decks)); 
        localStorage.setItem("sb_activeDeck", activeDeckId);
        localStorage.setItem("sb_vocab", vocabCount);
        localStorage.setItem("sb_streak", streakCount);
    }

    // ==========================================
    // 2. KIỂM TRA ĐĂNG NHẬP & BẢO MẬT
    // ==========================================
    const currentPage = window.location.pathname;
    const isLoggedIn = localStorage.getItem("sb_user") !== null;

    // Danh sách các trang không cho phép truy cập khi chưa đăng nhập
    const privatePages = ["trang7.html", "trang8.html", "trang2.html", "trang6.html", "trang9.html", "trang3.html"];
    
    let isPrivate = false;
    for (let i = 0; i < privatePages.length; i++) {
        if (currentPage.includes(privatePages[i])) {
            isPrivate = true;
            break;
        }
    }

    if (isPrivate && !isLoggedIn) {
        alert("Vui lòng đăng nhập để sử dụng tính năng này!");
        window.location.href = "trang1.html"; 
        return; 
    }

    // ==========================================
    // 3. CÁC HÀM TIỆN ÍCH DÙNG CHUNG
    // ==========================================
    function handleFeatureClick(targetPage) {
        let currentUser = localStorage.getItem("sb_user");
        if (currentUser !== null) {
            window.location.href = targetPage; 
        } else {
            window.location.href = "trang4.html"; 
        }
    }

    function renderDecks(deckArray) {
        const deckListContainer = document.getElementById("deckListContainer");
        if (deckListContainer !== null) {
            deckListContainer.innerHTML = ""; 

            if (deckArray.length === 0) {
                deckListContainer.innerHTML = `
                    <div id="notFoundMessage" style="text-align: center; padding: 40px; width: 100%;">
                        <img src="Suộc Ảnh/thinking.jpg" style="width: 100px; opacity: 0.5; margin-bottom: 15px;">
                        <p style="color: #666; font-family: 'Francois One', sans-serif; font-size: 18px;">
                            Hic, không tìm thấy bộ từ vựng nào khớp với từ khóa của bạn rồi! 😢
                        </p>
                        <button onclick="location.reload()" style="margin-top: 15px; padding: 8px 20px; border-radius: 20px; border: none; background: #fef142; cursor: pointer; font-weight: bold;">
                            Xem tất cả bài học
                        </button>
                    </div>
                `;
                const messageElement = document.getElementById("notFoundMessage");
                if (messageElement) {
                    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return; 
            }

            for (let i = 0; i < deckArray.length; i++) {
                const currentDeck = deckArray[i];
                const deckCard = document.createElement("div");
                
                deckCard.className = "list-item"; 
                deckCard.style.cursor = "pointer";

                const imgSrc = currentDeck.image ? currentDeck.image : "Suộc Ảnh/togiay.png";

                deckCard.innerHTML = `
                    <img src="${imgSrc}" class="item-thumb" alt="thumb">
                    <span style="font-size: 18px; font-weight: bold;">
                        ${currentDeck.title}
                        <span style="font-size: 14px; font-weight: normal; color: #666; margin-left: 5px;">(${currentDeck.cards.length} từ)</span>
                    </span>
                `;

                deckCard.addEventListener("click", function() {
                    activeDeckId = currentDeck.id;
                    saveData();
                    window.location.href = "trang8.html";
                });

                deckListContainer.appendChild(deckCard);
            }
        }
    }

    // ==========================================
    // 4. XỬ LÝ GIAO DIỆN CHUNG (HEADER, FOOTER, SEARCH)
    // ==========================================
    const loginBtnElement = document.querySelector(".login-btn");
    const currentUser = localStorage.getItem("sb_user");

    if (currentUser !== null && loginBtnElement !== null) {
        loginBtnElement.textContent = currentUser; 
        loginBtnElement.style.background = "#ffce00"; 
        loginBtnElement.style.color = "#000";
        
        const helloBoxTitle = document.querySelector(".hello-box h2");
        if (helloBoxTitle !== null) {
            const displayName = currentUser.split('@')[0]; 
            helloBoxTitle.textContent = "Hi, " + displayName + "!";
        }

        loginBtnElement.onclick = function(e) {
            e.preventDefault(); 
            if (confirm("Bạn có muốn đăng xuất khỏi hệ thống không?")) {
                localStorage.removeItem("sb_user"); 
                window.location.href = "trang1.html"; 
            }
        };
    }

    // Điều hướng Footer
    const ftFlashcard = document.getElementById("ft-flashcard");
    const ftQuiz = document.getElementById("ft-quiz");
    const ftLearn = document.getElementById("ft-learn");
    const ftRegister = document.getElementById("ft-register");

    if (ftFlashcard !== null) {
        ftFlashcard.addEventListener("click", function(e) { e.preventDefault(); handleFeatureClick("trang8.html"); });
    }
    if (ftQuiz !== null) {
        ftQuiz.addEventListener("click", function(e) { e.preventDefault(); handleFeatureClick("trang2.html"); });
    }
    if (ftLearn !== null) {
        ftLearn.addEventListener("click", function(e) { e.preventDefault(); handleFeatureClick("trang7.html"); });
    }
    if (ftRegister !== null) {
        ftRegister.addEventListener("click", function(e) { e.preventDefault(); window.location.href = "trang5.html"; });
    }

    // Thông báo tính năng đang phát triển
    const dummyLinks = document.querySelectorAll('a[href="#"], .show-alert');
    if (dummyLinks.length > 0) {
        for (let i = 0; i < dummyLinks.length; i++) {
            dummyLinks[i].addEventListener("click", function(event) {
                const isFunctionalLink = this.id === "ft-flashcard" || this.id === "ft-quiz" || 
                                         this.id === "ft-learn" || this.id === "ft-register" ||
                                         this.classList.contains("lang-selector");
                if (!isFunctionalLink) {
                    event.preventDefault(); 
                    alert("Tính năng này đang được phát triển. Bạn vui lòng quay lại sau nhé!");
                }
            });
        }
    }

    // Xử lý tìm kiếm
    const searchInputs = document.querySelectorAll(".search-container input, .search-input, .search-lesson input");
    if (searchInputs.length > 0) {
        for (let i = 0; i < searchInputs.length; i++) {
            searchInputs[i].addEventListener("click", function(event) { event.stopPropagation(); });
            searchInputs[i].addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                    const keyword = this.value.trim().toLowerCase();
                    const deckListContainer = document.getElementById("deckListContainer");
                    if (keyword === "") return; 

                    if (deckListContainer !== null) {
                        const filteredDecks = decks.filter(function(deck) {
                            return deck.title.toLowerCase().includes(keyword);
                        });
                        renderDecks(filteredDecks); 
                    } else {
                        localStorage.setItem("sb_searchQuery", keyword);
                        window.location.href = "trang7.html";
                    }
                }
            });
        }
    }

    // ==========================================
    // 5. XỬ LÝ TRANG CHỦ (TRANG 1)
    // ==========================================
    const loginBtn = document.querySelector(".login-btn");
    if (loginBtn !== null && !currentUser) {
        loginBtn.addEventListener("click", function() { window.location.href = "trang4.html"; });
    }

    const registerBtns = document.querySelectorAll(".register-now-btn, .register-btn");
    if (registerBtns.length > 0) {
        for (let i = 0; i < registerBtns.length; i++) {
            registerBtns[i].addEventListener("click", function() { window.location.href = "trang5.html"; });
        }
    }

    const blueStartBtn = document.querySelector(".blue-btn");
    if (blueStartBtn !== null) {
        blueStartBtn.addEventListener("click", function() {
            if (currentUser !== null) window.location.href = "trang8.html"; 
            else window.location.href = "trang4.html"; 
        });
    }

    const yellowStartBtn = document.querySelector(".yellow-btn");
    if (yellowStartBtn !== null) {
        yellowStartBtn.addEventListener("click", function() {
            if (currentUser !== null) window.location.href = "trang2.html"; 
            else window.location.href = "trang4.html"; 
        });
    }

    const cardStudy = document.getElementById("card-study");
    const cardFlashcard = document.getElementById("card-flashcard");
    const cardQuiz = document.getElementById("card-quiz");

    if (cardStudy !== null) cardStudy.addEventListener("click", function() { handleFeatureClick("trang7.html"); });
    if (cardFlashcard !== null) cardFlashcard.addEventListener("click", function() { handleFeatureClick("trang8.html"); });
    if (cardQuiz !== null) cardQuiz.addEventListener("click", function() { handleFeatureClick("trang2.html"); });

    const createBtn = document.querySelector(".create-btn");
    if (createBtn !== null) {
        createBtn.style.cursor = "pointer"; 
        createBtn.addEventListener("click", function() { handleFeatureClick("trang9.html"); });
    }

    // ==========================================
    // 6. XỬ LÝ FORM ĐĂNG NHẬP & ĐĂNG KÝ (TRANG 4, 5)
    // ==========================================
    const loginForm = document.getElementById("loginForm");
    if (loginForm !== null) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            const emailInput = document.getElementById("email").value;
            const passInput = document.getElementById("password").value;
            const savedAccount = localStorage.getItem("sb_account");

            if (savedAccount !== null) {
                const accountData = JSON.parse(savedAccount); 
                if (emailInput === accountData.userEmail && passInput === accountData.userPass) {
                    localStorage.setItem("sb_user", accountData.userName); 
                    alert("Đăng nhập thành công! Chào mừng " + accountData.userName);
                    window.location.href = "trang2.html"; 
                } else {
                    alert("❌ Email hoặc mật khẩu không chính xác!");
                }
            } else {
                alert("⚠️ Không tìm thấy tài khoản! Vui lòng Đăng ký trước.");
            }
        });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm !== null) {
        registerForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            const email = document.getElementById("regEmail").value;
            const username = document.getElementById("regUsername").value;
            const password = document.getElementById("regPassword").value;
            const confirmPassword = document.getElementById("regConfirmPassword").value;
            const termsChecked = document.getElementById("terms").checked;

            if (password !== confirmPassword) { alert("Mật khẩu xác nhận không khớp!"); return; }
            if (!termsChecked) { alert("Bạn phải đồng ý với điều khoản!"); return; }

            const newUser = { userEmail: email, userName: username, userPass: password };
            localStorage.setItem("sb_account", JSON.stringify(newUser));
            alert("Đăng ký thành công! Hãy đăng nhập để bắt đầu.");
            window.location.href = "trang4.html"; 
        });
    }

    const googleBtn = document.querySelector(".btn-social.google");
    const facebookBtn = document.querySelector(".btn-social.facebook");
    const isRegisterPage = document.getElementById("registerForm") !== null;

    if (googleBtn !== null) {
        googleBtn.addEventListener("click", function(e) {
            e.preventDefault(); 
            if (isRegisterPage) {
                alert("Đăng ký tài khoản bằng Google thành công!"); window.location.href = "trang4.html"; 
            } else {
                localStorage.setItem("sb_user", "nguoidung_google@gmail.com"); alert("Đăng nhập bằng Google thành công!"); window.location.href = "trang2.html"; 
            }
        });
    }

    if (facebookBtn !== null) {
        facebookBtn.addEventListener("click", function(e) {
            e.preventDefault();
            if (isRegisterPage) {
                alert("Đăng ký tài khoản bằng Facebook thành công!"); window.location.href = "trang4.html";
            } else {
                localStorage.setItem("sb_user", "user_facebook_123@yahoo.com"); alert("Đăng nhập bằng Facebook thành công!"); window.location.href = "trang2.html";
            }
        });
    }

    // ==========================================
    // 7. DASHBOARD & THƯ VIỆN (TRANG 6, 7)
    // ==========================================
    const vocabDisplay = document.getElementById("vocabCount");
    if (vocabDisplay !== null) vocabDisplay.textContent = vocabCount;

    const streakDisplay = document.getElementById("streakCount");
    if (streakDisplay !== null) streakDisplay.textContent = streakCount;

    const dashTodayLesson = document.getElementById("dashTodayLesson");
    if (dashTodayLesson !== null) {
        let currentDeck = decks[0]; 
        for (let i = 0; i < decks.length; i++) {
            if (decks[i].id === activeDeckId) { currentDeck = decks[i]; }
        }
        const todayCount = document.getElementById("todayLessonCount");
        const todayName = document.getElementById("todayLessonName");
        if (todayCount !== null) todayCount.textContent = currentDeck.cards.length + " thuật ngữ";
        if (todayName !== null) todayName.textContent = currentDeck.title;
        dashTodayLesson.addEventListener("click", function() { window.location.href = "trang8.html"; });
    }

    const folderStatBtn = document.getElementById("folderStat");
    if (folderStatBtn !== null) {
        folderStatBtn.addEventListener("click", function() { window.location.href = "trang7.html"; });
    }

    const reviewCountDisplay = document.getElementById("reviewCount");
    const hibernateCountDisplay = document.getElementById("hibernateCount");
    if (reviewCountDisplay !== null && hibernateCountDisplay !== null) {
        reviewCountDisplay.textContent = vocabCount;
        let totalWordsInLibrary = 0;
        for (let i = 0; i < decks.length; i++) { totalWordsInLibrary += decks[i].cards.length; }
        let hibernateWords = totalWordsInLibrary - vocabCount;
        if (hibernateWords < 0) hibernateWords = 0;
        hibernateCountDisplay.textContent = hibernateWords;
    }

    const deckListContainerCheck = document.getElementById("deckListContainer");
    if (deckListContainerCheck !== null) {
         const savedQuery = localStorage.getItem("sb_searchQuery");
         if (savedQuery !== null && savedQuery !== "") {
             const filteredDecks = decks.filter(function(deck) { return deck.title.toLowerCase().includes(savedQuery); });
             localStorage.removeItem("sb_searchQuery"); renderDecks(filteredDecks);
         } else { renderDecks(decks); }
    }

    // ==========================================
    // 8. TRANG HỌC FLASHCARD (TRANG 8)
    // ==========================================
    const flashcardArea = document.getElementById("flashcard");
    const isFlashcardPage = document.getElementById("flashcard") !== null;

    if (isFlashcardPage) {
        let currentDeck = decks[0]; 
        for (let i = 0; i < decks.length; i++) {
            if (decks[i].id === activeDeckId) currentDeck = decks[i]; 
        }
        
        const deckTitleDisplay = document.getElementById("deckTitleDisplay");
        if (deckTitleDisplay !== null) deckTitleDisplay.textContent = currentDeck.title;

        const vocabListContainer = document.querySelector(".vocab-list-container");
        if (vocabListContainer !== null) {
            vocabListContainer.innerHTML = '<h3 class="list-label">Nội dung</h3>';
            for (let i = 0; i < currentDeck.cards.length; i++) {
                const card = currentDeck.cards[i];
                const rowHtml = `
                    <div class="vocab-row">
                        <div class="term-col"><strong style="font-size: 18px;">${card.term}</strong></div>
                        <div class="divider-line"></div>
                        <div class="def-col">${card.definition}</div>
                        <div class="star-col" style="cursor: pointer; color: #ccc;">★</div>
                    </div>
                `;
                vocabListContainer.insertAdjacentHTML('beforeend', rowHtml);
            }
        }

        let currentCardIndex = 0; 
        const termElement = document.getElementById("cardTerm"); 
        const defElement = document.getElementById("cardDef"); 
        const countElement = document.getElementById("cardCount"); 
        const flashcardInner = document.querySelector(".flashcard-inner");

        function renderCard() {
            if (currentDeck.cards.length > 0) {
                if (flashcardInner !== null) flashcardInner.classList.remove("flipped");
                const currentCard = currentDeck.cards[currentCardIndex];
                setTimeout(function() {
                    if (termElement !== null) termElement.textContent = currentCard.term;
                    if (defElement !== null) defElement.textContent = currentCard.definition;
                    if (countElement !== null) countElement.textContent = (currentCardIndex + 1) + "/" + currentDeck.cards.length;
                }, 150);
            }
        }

        if (flashcardArea !== null) {
            flashcardArea.addEventListener("click", function() {
                if (flashcardInner !== null) { 
                    flashcardInner.classList.contains("flipped") ? flashcardInner.classList.remove("flipped") : flashcardInner.classList.add("flipped");
                }
            });
        }

        const nextCardBtn = document.getElementById("nextCard");
        if (nextCardBtn !== null) {
            nextCardBtn.addEventListener("click", function(e) { e.stopPropagation(); if (currentCardIndex < currentDeck.cards.length - 1) { currentCardIndex++; renderCard(); } });
        }

        const prevCardBtn = document.getElementById("prevCard");
        if (prevCardBtn !== null) {
            prevCardBtn.addEventListener("click", function(e) { e.stopPropagation(); if (currentCardIndex > 0) { currentCardIndex--; renderCard(); } });
        }

        renderCard();

        // Nút lưu/dots
        const topActionBtns = document.querySelectorAll(".btn-pill-white, .more-dots");
        for (let i = 0; i < topActionBtns.length; i++) {
            topActionBtns[i].addEventListener("click", function() { 
                if (this.id === "deleteDeckBtn") return; 
                const btnText = this.textContent.trim();
                if (btnText === "Lưu") alert("Đã lưu học phần này vào thư viện của bạn!");
                else alert("Tính năng '" + btnText + "' đang được phát triển. Vui lòng thử lại sau!");
            });
        }

        const tabs = document.querySelectorAll(".tab-pill");
        if (tabs.length >= 3) {
            tabs[0].addEventListener("click", function() { window.location.href = "trang7.html"; });
            tabs[2].addEventListener("click", function() { window.location.href = "trang2.html"; });
        }

        const toggleDefBtn = document.querySelector(".btn-footer-outline");
        let isDefHidden = false; 
        if (toggleDefBtn !== null) {
            toggleDefBtn.addEventListener("click", function() {
                isDefHidden = !isDefHidden; 
                const defColumns = document.querySelectorAll(".def-col");
                for (let i = 0; i < defColumns.length; i++) {
                    defColumns[i].style.opacity = isDefHidden ? "0" : "1"; 
                    defColumns[i].style.transition = "opacity 0.3s ease"; 
                }
                if (isDefHidden) { this.textContent = "Hiện định nghĩa"; this.style.background = "#e0e0e0"; } 
                else { this.textContent = "Ẩn định nghĩa"; this.style.background = "#fff"; }
            });
        }

        const activityBtn = document.querySelector(".btn-footer-solid");
        if (activityBtn !== null) activityBtn.addEventListener("click", function() { alert("Tính năng chơi mini-game ôn tập đang được phát triển!"); });

        const deleteDeckBtn = document.getElementById("deleteDeckBtn");
        if (deleteDeckBtn !== null) {
            deleteDeckBtn.addEventListener("click", function() {
                let currentDeckToDelete;
                for (let i = 0; i < decks.length; i++) { if (decks[i].id === activeDeckId) currentDeckToDelete = decks[i]; }
                const deckName = currentDeckToDelete ? currentDeckToDelete.title : "học phần này";
                if (confirm("Bạn có chắc chắn muốn xóa '" + deckName + "' không? Hành động này không thể hoàn tác!")) {
                    decks = decks.filter(function(deck) { return deck.id !== activeDeckId; });
                    if (decks.length === 0) { alert("Bạn đã xóa hết học phần! Hệ thống sẽ khôi phục lại các bài học mẫu."); localStorage.removeItem("sb_decks"); } 
                    else { activeDeckId = decks[0].id; saveData(); alert("Đã xóa học phần thành công!"); }
                    window.location.href = "trang7.html"; 
                }
            });
        }
    }

    // ==========================================
    // 9. TRANG TẠO THẺ MỚI (TRANG 9)
    // ==========================================
    const statusBtn = document.getElementById("statusBtn");
    const statusMenu = document.getElementById("statusMenu");
    const statusText = document.getElementById("statusText");
    const statusIcon = document.getElementById("statusIcon");
    const dropdownContainer = document.querySelector(".status-dropdown-container");

    if (statusBtn !== null && statusMenu !== null) {
        statusBtn.addEventListener("click", function(e) {
            e.stopPropagation(); 
            statusMenu.classList.toggle("show");
            dropdownContainer.classList.toggle("active");
        });

        const menuItems = statusMenu.querySelectorAll("li");
        for (let i = 0; i < menuItems.length; i++) {
            menuItems[i].addEventListener("click", function() {
                statusText.textContent = this.textContent;
                statusIcon.textContent = this.getAttribute("data-icon");
                if (this.getAttribute("data-status") === "private") statusBtn.style.backgroundColor = "#95a5a6"; 
                else statusBtn.style.backgroundColor = "#724E32"; 
                statusMenu.classList.remove("show"); dropdownContainer.classList.remove("active");
            });
        }

        document.addEventListener("click", function(e) {
            if (dropdownContainer && !dropdownContainer.contains(e.target)) {
                statusMenu.classList.remove("show"); dropdownContainer.classList.remove("active");
            }
        });
    }

    const btnAddMore = document.querySelector(".btn-add-more");
    const cardsContainer = document.querySelector(".vocabulary-cards-container");
    
    if (btnAddMore !== null && cardsContainer !== null) {
        btnAddMore.addEventListener("click", function() {
            const currentCardCount = document.querySelectorAll(".vocab-card-item").length;
            const newCardNumber = currentCardCount + 1;
            const newCardHTML = `
            <div class="vocab-card-item">
                <span class="card-number">${newCardNumber}</span>
                <div class="card-inputs-row">
                    <input type="text" placeholder="Thuật ngữ" class="input-term term-input">
                    <input type="text" placeholder="Định nghĩa" class="input-def def-input">
                </div>
                <div class="image-upload-box">Hình ảnh</div>
            </div>`;
            cardsContainer.insertAdjacentHTML('beforeend', newCardHTML);
        });
    }

    const addCardBtn = document.getElementById("addCardBtn");
    if (addCardBtn !== null) {
        addCardBtn.addEventListener("click", function() {
            const titleInput = document.getElementById("newDeckTitle");
            let deckTitle = (titleInput !== null && titleInput.value !== "") ? titleInput.value : "Bộ từ vựng mới"; 
            const termsInputs = document.querySelectorAll(".term-input");
            const defsInputs = document.querySelectorAll(".def-input");
            let newCardsArray = [];
            for (let i = 0; i < termsInputs.length; i++) {
                if (termsInputs[i].value !== "" && defsInputs[i].value !== "") {
                    newCardsArray.push({ term: termsInputs[i].value, definition: defsInputs[i].value });
                }
            }
            if (newCardsArray.length > 0) {
                const newId = "deck-" + Date.now();
                decks.push({ id: newId, title: deckTitle, cards: newCardsArray });
                activeDeckId = newId; saveData();
                alert("Đã lưu học phần mới!"); window.location.href = "trang8.html";
            } else { alert("Vui lòng nhập ít nhất 1 cặp từ và nghĩa!"); }
        });
    }

    const cardsContainerForImages = document.querySelector(".vocabulary-cards-container");
    if (cardsContainerForImages !== null) {
        cardsContainerForImages.addEventListener("click", function(e) {
            if (e.target.classList.contains("image-upload-box")) {
                const fileInput = document.createElement("input");
                fileInput.type = "file"; fileInput.accept = "image/png, image/jpeg"; 
                fileInput.addEventListener("change", function() {
                    if (fileInput.files && fileInput.files[0]) {
                        e.target.textContent = fileInput.files[0].name;
                        e.target.style.color = "#f39200"; e.target.style.fontSize = "12px";
                    }
                });
                fileInput.click(); 
            }
        });
    }

    // =========================================================
    // 10. TRANG TRẮC NGHIỆM, KHOÁ HỌC & THANH TOÁN (TRANG 2)
    // =========================================================
    const questionText = document.querySelector(".question p b");
    const answerContainers = document.querySelectorAll(".question .ans");

    if (questionText !== null && answerContainers.length > 0) {
        let currentDeck = decks.find(d => d.id === activeDeckId) || decks[0];
        let currentCards = currentDeck.cards;
        const randomIndex = Math.floor(Math.random() * currentCards.length);
        const correctCard = currentCards[randomIndex];
        questionText.textContent = correctCard.term;

        let answers = [{ text: correctCard.definition, isCorrect: true }];
        let fakeOptions = currentCards.filter((c, index) => index !== randomIndex);
        fakeOptions.sort(() => 0.5 - Math.random());
        if (fakeOptions.length > 0) answers.push({ text: fakeOptions[0].definition, isCorrect: false });
        if (fakeOptions.length > 1) answers.push({ text: fakeOptions[1].definition, isCorrect: false });
        answers.sort(() => 0.5 - Math.random());

        answerContainers.forEach((btn, index) => {
            if (answers[index]) {
                btn.textContent = answers[index].text;
                btn.dataset.correct = answers[index].isCorrect;
                btn.addEventListener("click", function() {
                    if (document.querySelector(".question .answered")) return;
                    answerContainers.forEach(b => b.classList.add("answered"));
                    if (this.dataset.correct === "true") { this.classList.add("correct-answer"); vocabCount++; streakCount++; } 
                    else { 
                        this.classList.add("wrong-answer"); streakCount = 0;
                        const rightBtn = Array.from(answerContainers).find(b => b.dataset.correct === "true");
                        if (rightBtn) rightBtn.classList.add("correct-answer");
                    }
                    saveData();
                    setTimeout(() => { window.location.reload(); }, 1500);
                });
            } else { btn.style.display = "none"; }
        });
    }

    // Carousel Khoá học
    const courseContainer = document.querySelector(".cackhoahoc");
    const prevBtn = document.querySelector(".prev-arrow");
    const nextBtn = document.querySelector(".next-arrow");
    if (courseContainer && prevBtn && nextBtn) {
        nextBtn.addEventListener("click", () => { courseContainer.scrollBy({ left: 250, behavior: 'smooth' }); });
        prevBtn.addEventListener("click", () => { courseContainer.scrollBy({ left: -250, behavior: 'smooth' }); });
    }

    // Modal Thanh toán
    const paymentModal = document.getElementById("payment-modal");
    const closeModal = document.querySelector(".close-modal");
    const payNowBtn = document.getElementById("pay-now-btn");
    const mImg = document.getElementById("modal-course-img");
    const mName = document.getElementById("modal-course-name");
    const mPrice = document.getElementById("modal-course-price");

    document.querySelectorAll(".course").forEach(card => {
        card.onclick = function() {
            const name = this.querySelector("h4").textContent;
            const price = this.querySelector("p").textContent;
            const img = this.querySelector("img").src;
            mName.textContent = name; mPrice.textContent = price; mImg.src = img;
            paymentModal.style.display = "flex";
        };
    });

    if(closeModal) closeModal.onclick = () => paymentModal.style.display = "none";
    window.onclick = (e) => { if(e.target == paymentModal) paymentModal.style.display = "none"; };

    if (payNowBtn) {
        payNowBtn.onclick = function() {
            const selectedMethod = document.querySelector('input[name="pay-method"]:checked').value;
            if (selectedMethod === "card") {
                const num = document.getElementById("visa-number").value.trim();
                const date = document.getElementById("visa-date").value.trim();
                const cvc = document.getElementById("visa-cvc").value.trim();
                if (num === "" || date === "" || cvc === "") { alert("❌ Vui lòng điền đầy đủ thông tin thẻ Visa của bạn!"); return; }
                if (num.length < 12) { alert("❌ Số thẻ không hợp lệ!"); return; }
            }
            this.textContent = "ĐANG XỬ LÝ..."; this.style.opacity = "0.7"; this.disabled = true;
            setTimeout(() => {
                alert("🎉 Thanh toán thành công khóa học: " + document.getElementById("modal-course-name").textContent);
                paymentModal.style.display = "none";
                this.textContent = "THANH TOÁN NGAY"; this.style.opacity = "1"; this.disabled = false;
            }, 2000);
        };
    }

    document.querySelectorAll('input[name="pay-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const detailBox = document.getElementById("method-details");
            if (this.value === 'qr') { detailBox.innerHTML = `<div class="qr-display"><p>Quét mã VietQR:</p><img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=SpongeBobPay" style="border:5px solid #fff"></div>`; } 
            else if (this.value === 'momo') { detailBox.innerHTML = `<p>Bạn sẽ được chuyển hướng sang ứng dụng MoMo để hoàn tất.</p>`; } 
            else {
                detailBox.innerHTML = `
                <div class="card-input-group">
                    <input type="text" id="visa-number" placeholder="Số thẻ Visa/Master" class="visa-field">
                    <div style="display:flex; gap:5px; margin-top:5px;">
                        <input type="text" id="visa-date" placeholder="MM/YY" class="visa-field" style="width:50%">
                        <input type="text" id="visa-cvc" placeholder="CVC" class="visa-field" style="width:50%">
                    </div>
                </div>`;
            }
        });
    });

    // Coupon giảm giá
    const applyBtn = document.getElementById("apply-coupon");
    const couponInput = document.getElementById("coupon-input");
    const couponMsg = document.getElementById("coupon-message");
    const priceDisplay = document.getElementById("modal-course-price");
    if (applyBtn) {
        applyBtn.onclick = function() {
            const code = couponInput.value.trim().toUpperCase();
            let currentPriceText = priceDisplay.textContent.replace(/[. VND]/g, "");
            let currentPrice = parseInt(currentPriceText);
            if (code === "NEU2026" || code === "SPONGEBOB") {
                let discount = 0.2; let newPrice = currentPrice * (1 - discount);
                priceDisplay.innerHTML = `<del style="font-size: 14px; color: #999;">${currentPrice.toLocaleString()} VND</del><br>${newPrice.toLocaleString()} VND`;
                couponMsg.textContent = "✅ Đã áp dụng mã giảm giá 20%!";
                couponMsg.style.color = "green"; applyBtn.disabled = true; couponInput.disabled = true;
            } else if (code === "") { couponMsg.textContent = "⚠️ Vui lòng nhập mã!"; couponMsg.style.color = "orange"; } 
            else { couponMsg.textContent = "❌ Mã không hợp lệ hoặc đã hết hạn!"; couponMsg.style.color = "red"; }
        };
    }

    // Nút tạo nhanh Flashcard ở Dashboard
    const startCreateBtn = document.querySelector(".flashcards button");
    if (startCreateBtn !== null) {
        startCreateBtn.addEventListener("click", function() { window.location.href = "trang9.html"; });
    }

    // Sidebar thư viện
    const sidebarLibLink = document.querySelector(".nav-link[href='#']");
    if (sidebarLibLink && sidebarLibLink.textContent.includes("Thư viện")) {
        sidebarLibLink.addEventListener("click", function(e) { e.preventDefault(); window.location.href = "trang7.html"; });
    }

    // Cuộn mượt đến khoá học
    const btnCuon = document.getElementById("btn-cuon-khoa-hoc");
    const mucKhoaHoc = document.getElementById("khoa-hoc-section");
    if (btnCuon !== null && mucKhoaHoc !== null) {
        btnCuon.addEventListener("click", function() { mucKhoaHoc.scrollIntoView({ behavior: "smooth", block: "center" }); });
    }

    // ==========================================
    // 11. XỬ LÝ LỊCH TƯƠNG TÁC
    // ==========================================
    const dayNumBox = document.getElementById("current-day-num");
    const monthSelect = document.getElementById("month-select");
    const yearSelect = document.getElementById("year-select");
    const daysGrid = document.getElementById("calendar-days");
    const confirmBtn = document.getElementById("calendar-confirm-btn");

    if (daysGrid) {
        const now = new Date();
        let currentMonth = now.getMonth();
        let currentYear = now.getFullYear();
        let selectedDay = now.getDate();
        dayNumBox.textContent = selectedDay < 10 ? "0" + selectedDay : selectedDay;
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        for(let i = 0; i < months.length; i++) {
            const opt = document.createElement("option"); opt.value = i; opt.textContent = months[i];
            if(i === currentMonth) opt.selected = true; monthSelect.appendChild(opt);
        }
        for(let i = 2024; i <= 2030; i++) {
            const opt = document.createElement("option"); opt.value = i; opt.textContent = i;
            if(i === currentYear) opt.selected = true; yearSelect.appendChild(opt);
        }

        function renderCalendar() {
            daysGrid.innerHTML = "";
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            for(let i = 0; i < firstDay; i++) daysGrid.appendChild(document.createElement("div"));
            for(let i = 1; i <= daysInMonth; i++) {
                const dayDiv = document.createElement("div"); dayDiv.textContent = i;
                if(i === selectedDay) dayDiv.classList.add("selected");
                dayDiv.onclick = function() {
                    const prevSel = document.querySelector(".days-grid .selected");
                    if(prevSel) prevSel.classList.remove("selected");
                    dayDiv.classList.add("selected"); selectedDay = i;
                    dayNumBox.textContent = i < 10 ? "0" + i : i;
                };
                daysGrid.appendChild(dayDiv);
            }
        }

        monthSelect.onchange = function() { currentMonth = parseInt(monthSelect.value); renderCalendar(); };
        yearSelect.onchange = function() { currentYear = parseInt(yearSelect.value); renderCalendar(); };
        confirmBtn.onclick = function() { alert("Đã đặt lịch nhắc nhở học tập cho ngày " + selectedDay + " " + months[currentMonth] + "!"); };
        renderCalendar();
    }
}); 

// ==========================================================
// 12. XỬ LÝ MENU DROPDOWN TOÀN CỤC (GỌI TRỰC TIẾP TỪ HTML)
// ==========================================================
function toggleMenu() {
    const menu = document.getElementById("menu");
    if (menu) menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function chonLang(lang) {
    const langBtn = document.getElementById("lang-button");
    const menu = document.getElementById("menu");
    if (langBtn) langBtn.innerHTML = "<b>" + lang + " ▼</b>";
    if (menu) menu.style.display = "none";
}

function toggleAddMenu() {
    const addMenu = document.getElementById("addMenu");
    if (addMenu) addMenu.style.display = addMenu.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (e) {
    const langMenu = document.getElementById("menu");
    const addMenu = document.getElementById("addMenu");
    const langBtn = document.getElementById("lang-button");
    const addBtn = document.getElementById("add-button");

    if (langBtn && langMenu) { if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) langMenu.style.display = "none"; }
    if (addBtn && addMenu) { if (!addBtn.contains(e.target) && !addMenu.contains(e.target)) addMenu.style.display = "none"; }
});