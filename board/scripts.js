function addComment() {
    const nicknameInput = document.getElementById('nickname-input');
    const commentInput = document.getElementById('comment-input');
    const nicknameText = nicknameInput.value.trim();
    const commentText = commentInput.value.trim();

    if (nicknameText === '') {
        alert('닉네임을 입력해주세요');
        return;
    }

    if (commentText === '') {
        alert('코멘트를 입력해주세요');
        return;
    }

    if (nicknameText !== '' && commentText !== '') {
        const commentsDiv = document.getElementById('comments');
        const newComment = document.createElement('div');
        newComment.className = 'card mb-3 shadow-sm';

        const commentBody = document.createElement('div');
        commentBody.className = 'card-body';

        const commentHeader = document.createElement('h5');
        commentHeader.className = 'card-title';
        commentHeader.textContent = nicknameText;

        const commentContent = document.createElement('p');
        commentContent.className = 'comment-text';
        commentContent.textContent = commentText;

        const commentButtons = document.createElement('div');
        commentButtons.className = 'text-right';

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning btn-sm mr-2';
        editButton.textContent = 'Edit';
        editButton.onclick = function() {
            editComment(commentContent, editButton);
        };

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteComment(newComment);
        };

        commentButtons.appendChild(editButton);
        commentButtons.appendChild(deleteButton);

        commentBody.appendChild(commentHeader);
        commentBody.appendChild(commentContent);
        commentBody.appendChild(commentButtons);

        newComment.appendChild(commentBody);
        commentsDiv.appendChild(newComment);

        nicknameInput.value = ''; // Clear the nickname input field
        commentInput.value = ''; // Clear the comment input field

        //새로 추가된 코멘트로 이동
        scrollToElement(newComment);
    }
}

function deleteComment(commentElement) {
    if (confirm('삭제를 원하십니까?')) {
        commentElement.remove();
    }
}

function editComment(commentContent, editButton) {
    if (editButton.textContent === 'Edit') {
        const currentText = commentContent.textContent;
        const textArea = document.createElement('textarea');
        textArea.className = 'form-control mb-2';
        textArea.value = currentText;
        commentContent.style.display = 'none';
        commentContent.parentElement.insertBefore(textArea, commentContent);

        editButton.textContent = 'Save';
        editButton.classList.remove('btn-warning');
        editButton.classList.add('btn-success');

        editButton.onclick = function() {
            saveComment(commentContent, textArea, editButton);
        };
    }
}

function saveComment(commentContent, textArea, saveButton) {
    const newText = textArea.value.trim();

    if (newText !== '') {
        commentContent.textContent = newText;
        commentContent.style.display = 'block';
        textArea.remove();

        saveButton.textContent = 'Edit';
        saveButton.classList.remove('btn-success');
        saveButton.classList.add('btn-warning');

        saveButton.onclick = function() {
            editComment(commentContent, saveButton);
        };
    } else {
        alert('코멘트를 채워주세요');
    }
}

function scrollToElement(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
