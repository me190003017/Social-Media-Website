$(document).ready(()=>{
    loadPosts()
})
// tab-post
// tab-reply
// tab-like
async function loadPosts(){
   let posts=await axios.get('/api/post',{params:{postedBy:profileUserId}})//this is how we send query parameter to axios
    // console.log(posts)
    // console.log(posts)
    // console.log(profileUserId)
    if(flag==='posts'){
        
            $('.tab-like').removeClass('active')
            $('.tab-reply').removeClass('active')
            $('.tab-post').addClass('active')
        for(let post of posts.data){
            // console.log(post)
            const html=createPostHtml(post)
            $('.userPostsContainer').prepend(html)
        }
    }else{
        if(flag=='replies'){
            $('.tab-post').removeClass('active')
            $('.tab-like').removeClass('active')
            $('.tab-reply').addClass('active')

            for(let post of posts.data){
                if(post.replyTo===undefined){
                    //
                }else{
                    const html=createPostHtml(post)
                    $('.userPostsContainer').prepend(html)
                }
            }
        }else{
            $('.tab-post').removeClass('active')
            $('.tab-reply').removeClass('active')
            $('.tab-like').addClass('active')
            
            // console.log(flag,profileUserId)
            //likes 
            const user=await axios.get('/profile/user',{params:{postedBy:profileUserId}});
            posts=user.data.likes;
            console.log(posts)
            // console.log(posts[0]._id)
            for(let i=0;i<posts.length;i++){
                const x=await axios.get(`/api/posts/${posts[i]._id}`);
                // console.log(x.data);
                const html=createPostHtml(x.data)
                $('.userPostsContainer').prepend(html)
            }
        }
    }

}

// if(post.replyTo!==undefined || post.replyTo._id !== undefined)


// create html for created post
function createPostHtml(postData) {
    
    const postedBy = postData.postedBy;

    if(postedBy===undefined || postedBy._id === undefined) {
        return console.log("User object not populated");
    }

    const displayName = postedBy.firstName + " " + postedBy.lastName;
    const timestamp = timeDifference(new Date(),new Date(postData.createdAt));
    
    let replyFlag = "";
  if (postData.replyTo && postData.replyTo._id) {
    if (!postData.replyTo._id) {
      return alert("Reply to is not populated");
    } else if (!postData.replyTo.postedBy._id) {
      return alert("Posted by is not populated");
    }

    const replyToUsername = postData.replyTo.postedBy.username;
    replyFlag = `<div class='replyFlag'>
                          Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}<a>
                      </div>`;
  }
    return `<div class='post' data-id='${postData._id}'>

                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                            <div>${replyFlag}</div>
                        
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button class="comment" data-bs-toggle="modal" data-bs-target="#replyModal">
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer green'>
                                <button class='retweet'>
                                    <i class='fas fa-retweet'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer red'>
                                <button class='likeButton'>
                                    <i class='far fa-heart'></i>
                                    <span>${postData.likes.length||""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}

// to calculate how much time ago post published

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {

        if(elapsed/1000 < 30){

            return "Just now";
        }

         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
