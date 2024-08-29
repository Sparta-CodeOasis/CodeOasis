import { commentRepository } from './supabase/commentRepository.js';

export function initializeComments(memberId, supabase) {
    const repository = commentRepository(supabase);

    async function loadComments() {
        try {
            const comments = await repository.getComments(memberId);
            const commentsDiv = document.getElementById('comments');
            commentsDiv.innerHTML = '';
            comments.forEach(comment => addCommentToDOM(comment, false));
        } catch (error) {
            console.error('댓글 로드 중 오류 발생:', error);
            alert('코멘트를 불러오는 중 오류가 발생했습니다');
        }
    }

    async function addComment(content, nickname) {
        try {
            const newComment = await repository.addComment(memberId, content, nickname);
            addCommentToDOM(newComment, true);
            document.getElementById('nickname-input').value = '';
            document.getElementById('comment-input').value = '';
        } catch (error) {
            console.error('댓글 추가 중 오류 발생:', error);
            alert('코멘트 추가 중 오류가 발생했습니다');
        }
    }

    function addCommentToDOM(comment, shouldScroll = false) {
        const commentsDiv = document.getElementById('comments');
        const newComment = document.createElement('div');
        newComment.className = 'card mb-3 shadow-sm';
        newComment.id = `comment-${comment.id}`;
    
        newComment.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${comment.nickname}</h5>
                <p class="comment-text">${convertNewlinesToBreaks(comment.content)}</p>
                <div class="text-right">
                    <button class="btn btn-warning btn-sm mr-2" onclick="editComment(${comment.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteComment(${comment.id})">Delete</button>
                </div>
            </div>
        `;
    
        commentsDiv.appendChild(newComment);
        if (shouldScroll) {
            scrollToElement(newComment);
        }
    }

    function convertNewlinesToBreaks(text) {
        return text.replace(/\n/g, '<br>');
    }

    async function deleteComment(commentId) {
        if (confirm('삭제를 하시겠습니까?')) {
            try {
                await repository.deleteComment(commentId);
                const commentElement = document.getElementById(`comment-${commentId}`);
                if (commentElement) {
                    commentElement.remove();
                }
            } catch (error) {
                console.error('댓글 삭제 중 오류 발생:', error);
                alert('코멘트 삭제 중 오류가 발생했습니다');
            }
        }
    }

    function editComment(commentId) {
        const commentElement = document.getElementById(`comment-${commentId}`);
        const commentText = commentElement.querySelector('.comment-text');
        const editButton = commentElement.querySelector('.btn-warning');

        if (editButton.textContent === 'Edit') {
            const currentText = commentText.textContent;
            const textArea = document.createElement('textarea');
            textArea.className = 'form-control mb-2';
            textArea.value = currentText;
            commentText.style.display = 'none';
            commentText.parentElement.insertBefore(textArea, commentText);

            editButton.textContent = 'Save';
            editButton.classList.remove('btn-warning');
            editButton.classList.add('btn-success');

            editButton.onclick = function() {
                saveComment(commentId, commentText, textArea, editButton);
            };
        }
    }

    async function saveComment(commentId, commentText, textArea, saveButton) {
        const newText = textArea.value.trim();

        if (newText !== '') {
            try {
                await repository.updateComment(commentId, newText);
                commentText.textContent = newText;
                commentText.style.display = 'block';
                textArea.remove();

                saveButton.textContent = 'Edit';
                saveButton.classList.remove('btn-success');
                saveButton.classList.add('btn-warning');

                saveButton.onclick = function() {
                    editComment(commentId);
                };
            } catch (error) {
                console.error('댓글 수정 중 오류 발생:', error);
                alert('코멘트 수정 중 오류가 발생했습니다');
            }
        } else {
            alert('코멘트를 채워주세요');
        }
    }

    function scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 이벤트 리스너 등록
    document.querySelector('.btn-primary').addEventListener('click', () => {
        const content = document.getElementById('comment-input').value.trim();
        const nickname = document.getElementById('nickname-input').value.trim();
        if (content && nickname) {
            addComment(content, nickname);
        } else {
            alert('닉네임과 코멘트를 모두 입력해주세요');
        }
    });

    // 전역 함수로 등록 (HTML에서 onclick 이벤트에서 사용)
    window.editComment = editComment;
    window.deleteComment = deleteComment;

    // 초기 댓글 로드
    loadComments();
}