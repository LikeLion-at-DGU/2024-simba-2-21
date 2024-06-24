//////////// main - custom 공통부분 /////////
// 1. 슬라이더 기능
document.addEventListener('DOMContentLoaded', () => {
    const sliderWrap = document.querySelector('.slider__wrap');
    const sliderImg = sliderWrap.querySelector('.slider__img');
    const sliderInner = sliderWrap.querySelector('.slider__inner');
    const sliders = sliderWrap.querySelectorAll('.slider');
    const sliderDot = sliderWrap.querySelector('.slider__dot');
    const sliderBtn = sliderWrap.querySelectorAll('.slider__btn a');

    let currentIndex = 0;
    const sliderCount = sliders.length;
    const sliderWidth = sliders[0].offsetWidth;
    let dotIndex = '';

    function init() {
        sliders.forEach(() => dotIndex += "<a href='#' class='dot'></a>");
        sliderDot.innerHTML = dotIndex;
        if (sliderDot.firstChild) {
            sliderDot.firstChild.classList.add('active');
        }
    }

    function gotoSlider(num) {
        sliderInner.style.transition = 'all 0.4s';
        sliderInner.style.transform = 'translateX(' + (-sliderWidth * num) + 'px)';
        currentIndex = num;

        const dots = document.querySelectorAll('.slider__dot .dot');
        if (dots && dots.length > 0) {
            dots.forEach((dot) => dot.classList.remove('active'));
            if (dots[num]) {
                dots[num].classList.add('active');
            } else {
                console.error('dots[' + num + '] 요소를 찾을 수 없습니다.');
            }
        } else {
            console.error('.slider__dot .dot 요소를 찾을 수 없습니다.');
        }
    }

    sliderBtn.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            let newIndex = currentIndex;

            if (btn.classList.contains('prev')) {
                newIndex = (currentIndex + sliderCount - 1) % sliderCount;
            } else {
                newIndex = (currentIndex + 1) % sliderCount;
            }

            gotoSlider(newIndex);
        });
    });

    init();
});

// 2. 하트 기능

document.addEventListener('DOMContentLoaded', function() {
    const heartButtons = document.querySelectorAll('#heart_btn');

    heartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const customId = this.dataset.customId;  // main.js: 'varsityId'
            const likeCountElem = this.querySelector('p');
            const iconHeart = this.querySelector('#icon_heart');

            fetch(`/likecustom/${customId}/`, {  // main.js: '/like/${varsityId}/'
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.like_count !== undefined) {
                    likeCountElem.textContent = data.like_count;
                    if (data.is_liked) {
                        iconHeart.src = "/static/assets/icons/heart_filled.png";
                    } else {
                        iconHeart.src = "/static/assets/icons/heart.png";
                    }
                    console.log(`Total likes: ${data.like_count}`);
                }
            });
        });
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});

///3. 필터기능
document.addEventListener('DOMContentLoaded', function() {
    const selectedDepartments = JSON.parse(localStorage.getItem('selectedDepartments')) || [];
    const count = selectedDepartments.length;
    document.getElementById('filter_count').textContent = count;

    if (count === 0) {
        document.getElementById('icon_filter_bk').style.display = 'flex';
        document.getElementById('icon_filter_blue').style.display = 'none';
        document.getElementById('filter_count').style.visibility = 'hidden';
    } else {
         // count가 0이 아니면 필터 이미지를 파란색으로 바꾸고 filter_count 요소를 표시
         document.getElementById('icon_filter_bk').style.display = 'none';
         document.getElementById('icon_filter_blue').style.display = 'flex';
         document.getElementById('filter_count').style.visibility = 'visible';
         document.getElementById('filter_count').textContent = count;
    }

    document.getElementById('filter_btn').addEventListener('click', function() {
        window.location.href = '/customfilter';
    });
});

///////////    초기화 버튼    /////////
document.getElementById('reset_btn').addEventListener('click', function() {
    //selectedDepartments 초기화
    const selectedDepartments = [];
    console.log(selectedDepartments);

    // 로컬 스토리지에 저장
    localStorage.setItem('selectedDepartments', JSON.stringify(selectedDepartments));

    //새로고침 시행
    location.reload();
})




///4. 검색기능///
// total_customs 값을 콘솔에 출력하여 확인
console.log("템플릿에서 전달된 total_customs: {{ total_customs }}");

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search_input');
    const suggestionsContainer = document.getElementById('suggestions');
    const suggestionsList = document.getElementById('suggestions_list');

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query.length > 0) {
            fetch(`/custom/suggestions/?q=${query}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Suggestions:', data); // 서버에서 반환된 데이터 확인
                    suggestionsList.innerHTML = '';

                    data.forEach(item => {
                        const titleMatch = item.title.toLowerCase().includes(query);
                        const majorMatch = item.major.toLowerCase().includes(query);
                        const colorMatch = item.color.toLowerCase().includes(query);
                        const collegeMatch = item.college.toLowerCase().includes(query);

                        let liContent = '';

                        if (titleMatch) {
                            liContent = item.title;
                        } else if (majorMatch) {
                            liContent = item.major;
                        } else if (colorMatch) {
                            liContent = item.color;
                        } else if (collegeMatch) {
                            liContent = item.college;
                        } else {
                            return; // 일치하는 항목이 없으면 넘어가기
                        }

                        const li = document.createElement('li');
                        li.innerHTML = liContent;
                        li.addEventListener('click', function() {
                            searchInput.value = item.title; // 검색창에 제목만 채우기
                            suggestionsContainer.style.display = 'none';
                            document.getElementById('search_form').submit(); // 검색 폼 제출
                        });
                        suggestionsList.appendChild(li);
                    });

                    if (data.length > 0) {
                        suggestionsContainer.style.display = 'block';
                    } else {
                        suggestionsContainer.style.display = 'none';
                    }
                });
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });

    // 검색 창 토글
    const searchContainer = document.getElementById('search_container');
    if (searchContainer.style.display === 'none') {
        searchContainer.style.display = 'block';
    } else {
        searchContainer.style.display = 'none';
    }
}); 

