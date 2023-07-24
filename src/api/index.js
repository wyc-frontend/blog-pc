import ajax from "./ajax";

export const reqLogin = (data)=> ajax({method:'post',url:'/admin/login',data:{username:data.uname,password:data.pass}})
export const reqRegister = (data)=> ajax({method:'post',url:'/admin/register',data:{username:data.uname,password:data.pass}})
export const reqWebLogin = (data)=> ajax({method:'post',url:'/login',data:{username:data.userName,password:data.passWord}})
export const reqWebRegister = (data)=> ajax({method:'post',url:'/register',data:{username:data.userName,password:data.passWord}})
export const reqExitLoginWeb = (data)=> ajax({method:'post',url:'/exit',data:{username:data.username,token:data.token}})
export const updateUser = (data) => ajax({method:'post',url:'/updateuser',data:{id:data.id,userName:data.userName,pwd:data.pwd}})

export const reqUserInfo = (data)=> ajax({method:'post',url:'/userinfo',data:{username:data.username}})
export const addMsgBoard = (data)=> ajax({method:'post',url:'/messageboard',data:{uName:data.uName,msg:data.msg,time:data.time,img:data.img}})
export const delmsgboard = (data)=> ajax({method:'post',url:'/delmsgboard',data:{id:data}})
export const replyMsgBoard = (data)=> ajax({method:'post',url:'/replyMsg',data:{uName:data.uName,msg:data.msg,time:data.time,img:data.img,id:data.id}})
export const reqMsgBoardData = ()=> ajax({method:'post',url:'/getmsgboard'})
export const reqReplyMsgData = ()=> ajax({method:'post',url:'/getreplymsgdata'})

export const reqPhotoWall = ()=> ajax({method:'post',url:'/photowall'})
export const delPhoto = (data)=> ajax({method:'post',url:'/photowalldel',data:{picId:data}})

export const writeBlog = (data)=> ajax({method:'post',url:'/writeblog',data:{username:data.author,time:data.time,description:data.description,main:data.main,title:data.title,cname:data.classifyVal,text:data.text}})
export const delArticle = (data) => ajax({method:'post',url:'/delarticle',data:{id:data}}) 
export const addClassify = (data)=> ajax({method:'post',url:'/addclassify',data:{cName:data}})
export const getClassifyList = ()=> ajax({method:'post',url:'/getclassifylist'})
export const delClassify = (data)=> ajax({method:'post',url:'/delclassify',data:{cid:data}})
export const updClassify = (data)=> ajax({method:'post',url:'/updclassify',data:{cname:data.cname,cid:data.cid}})
export const getArticleList = ()=> ajax({method:'get',url:'/getarticlelist'})
export const updateArticle = (data)=> ajax({method:'post',url:'/updatearticle',data:{html:data.html,id:data.id,text:data.text}})



