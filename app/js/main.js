const api = "https://api.myjson.com/bins/x91hl";

const body = document.body;
const postContainer = document.querySelector('#site-posts');

fetch(api)
    .then(blob => blob.json())
    .then(data => {
    
    const posts = data;
    
    // create createNode
    // createNode
    function createNode(el){
        return document.createElement(el);
    }
    
    // for loop
    for( const post of posts){
//        console.log(post.Title);
        
    const postDiv = createNode('div');
    postDiv.className = 'post';
    postDiv.innerHTML =
        `<p class="post__category post__category--${post.Category.toLowerCase()} ">${post.Category}</p>
        <h2 class="post__title">${post.Title}</h2>

        <div class="post__meta post__meta--${post.Category.toLowerCase()}">
            <div class="post__comment">
                <i class="fa fa-comment" aria-hidden="true"></i> ${post.Comments} ${post.Comments != 1 ? ` Comments` : ` Comment`} ${post.Comments > 5 ? ` <i class="fa fa-fire" aria-hidden="true"></i>` : ``}
            </div>

            <div class="post__time">
                <i class="fa fa-clock-o" aria-hidden="true"></i>
                <span>${post.Date}</span>
            </div>
        </div>`;
        
    // insert posts into post container
    postContainer.appendChild(postDiv);
        
    } // end of for loop
    
    
    
    
    // slice to 8 posts
    
    })
    .catch(error => console.log(error));
