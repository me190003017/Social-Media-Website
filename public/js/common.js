
async function refreshPosts(){
    $('.postsContainer').empty();
    const tweets = await axios.get('/api/post').catch((err)=>console.log(err))
    // console.log(tweets)
    for(let post of tweets.data){
        const html=createPostHtml(post)
        $('.postsContainer').prepend(html)
    }
}


refreshPosts();

// creating a new post
$('#submitPostButton').click(async()=>{
    const postText=$('#post-text').val();
    // console.log(postText)
    const newPost=await axios.post('/api/post',{content:postText}).catch((err)=>console.log(err))
    console.log(newPost)
    $('#post-text').val("");
    refreshPosts();
})

// .on method on whole documnet and click on likeButton we are using this because it work dynamically when we create new elements
$(document).on('click','.likeButton',async(e)=>{
    const button=$(e.target); // we are getting button 
    const postId=getPostIdFromElement(button);
    
    const postData=await axios.patch(`/api/posts/${postId}/like`);
    // console.log(postData);
})

$("#replyModal").on('show.bs.modal',async(e)=>{
    const button=$(e.relatedTarget);
    const postId=getPostIdFromElement(button);
    $('#submitReplyButton').attr('data-id',postId);
    
    // I will simply send get request
    const postData=await axios.get(`/api/posts/${postId}`)
    const html=createPostHtml(postData.data);
    $('#originalPostContainer').empty();
    $('#originalPostContainer').append(html);
})

$('#submitReplyButton').click(async(e)=>{
    const element=$(e.target);
    const postText=$('#reply-text-container').val();
    const replyTo=element.attr('data-id');
    const postData= await axios.post('/api/post',{content:postText,replyTo:replyTo})
    location.reload();
})

// function to get id of post from element
function getPostIdFromElement(element){
    // first let's check whether current element is root or not
    const isRoot=element.hasClass('post');
    const rootElement=isRoot==true ? element : element.closest('.post')
    // now let's grab id of post
    const postId=rootElement.data().id;
    
    return postId
}

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
                                <button data-bs-toggle="modal" data-bs-target="#replyModal">
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
