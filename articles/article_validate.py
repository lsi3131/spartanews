

def validate_article_data(data):
    
   
    title = data.get('title')
    if not title:
        return {"error": "제목을 입력해주세요."}
    
    article_type = data.get('article_type')
    if article_type not in ['news', 'ask', 'show']:
        return{"error": "올바르지 않은 게시글 타입입니다."}
    if article_type != 'ask':
        article_link = data.get('article_link')
        if not article_link:
            return {"error": "Url을 입력해주세요."}
    else:
        data["article_link"] = ''

    content = data.get('content')
    if not content:
        return {"error": "내용을 입력해주세요."}
    return None


def validate_comment_data(data):
    content = data.get('content')
    if not content:
        return {"error": "내용을 입력해주세요."}
    return None

