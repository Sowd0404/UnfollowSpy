const Request = require("request-promise");
const Asker = require("readline-sync")

// Your IG data
console.log(`
    To retrieve your Cookie, AppId & userId, simply click on the users followers/following
    While having inspect element open on the network tab, you should see a request pop up
    called "?count=12" this should be your indicator that you have found the request which
    has all the info you need. 

    Click on that request and it should show you more info about the Request Headers, in 
    the Request Headers you will see cookie and x-ig-app-id and you need to just right click
    those values and click "copy value" and insert it into this console when prompted to.

    More visual info is most likely provided in the read me and there will be updates to make 
    this process much more simple.
`)

const cookie = Asker.question("Insert your Cookie here: ")
const igAppId = Asker.question("Insert your App Id here: ")
const userId = Asker.question("Insert the userId of the user who's followers you'd like to spy on: ")
const Timeout = Asker.question("How often would you like to check on this user's followers(Seconds): ")

const GetFollowers = async (UserId) => {

    let Followers = await Request({
        method: 'GET',
        url: `https://i.instagram.com/api/v1/friendships/${UserId}/followers/?count=${1e6}&search_surface=follow_list_page`,
        headers: {
            'Cookie': cookie,
            'x-ig-app-id': igAppId
        }
    });

    return JSON.parse(Followers)
}

GetFollowers(userId)
    .then(OriginalFollowers => {
        setInterval(async () => {
            const Followers = await GetFollowers(userId);
                
            OriginalFollowers.users.forEach((User, Index, Object) => {
                const UnfollowedCheck = Followers.users.filter(Account => Account.username === User.username);
                if (UnfollowedCheck.length <= 0) {
                    console.log(`${User.username} has unfollowed you!`)
                    Object.splice(Index, 1)
                };
            });
                
            Followers.users.forEach(User => {
                const FollowedCheck = OriginalFollowers.users.filter(Account => Account.username === User.username);
                if (FollowedCheck.length <= 0 ) {
                    console.log(`${User.username} has followed you!`)
                    OriginalFollowers.users.push(User)
                };
            });
                
        }, Timeout * 1000);
    });
    
    