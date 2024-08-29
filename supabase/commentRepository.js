export const commentRepository = (supabase) => ({
    async getComments(boardId) {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('board_id', boardId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('코멘트 조회 중 오류 발생 :', error);
            throw error;
        }

        return data;
    },

    async addComment(boardId, content, nickname) {
        const { data, error } = await supabase
            .from('comments')
            .insert([
                { 
                    board_id: boardId,
                    content: content,
                    nickname: nickname,
                    created_at: new Date()
                }
            ])
            .select();

        if (error) {
            console.error('코멘트 저장 중 오류 발생 :', error);
            throw error;
        }
        console.log("추가된 코멘트 : "+ data[0])
        return data && data.length > 0 ? data[0] : null;
    },

    async updateComment(commentId, newContent) {
        const { error } = await supabase
            .from('comments')
            .update({ content: newContent })
            .eq('id', commentId);

        if (error) {
            console.error('코멘트 수정 중 오류 발생 :', error);
            throw error;
        }
    },

    async deleteComment(commentId) {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (error) {
            console.error('코멘트 삭제 중 오류 발생:', error);
            throw error;
        }
    }
});
