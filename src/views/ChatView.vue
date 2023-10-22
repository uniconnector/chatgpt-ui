<script setup lang='ts'>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { router } from '@/router'
  import { useScroll } from './hooks/useScroll'
  import VuePdfApp from "vue3-pdf-app"
  import "vue3-pdf-app/dist/icons/main.css"
  import { encode } from 'gpt-tokenizer'


  const { scrollRef, scrollToBottom } = useScroll()

  // 会话和PDF预览面板切换控制
  let showTab = ref<string>("nav-tab-chat")
  let tabWidth = ref<string>("")

  // vue3-pdf-app 界面配置
  let pdfFile = ref<string>("")
  const config = ref<{}>({
    sidebar: true,
    toolbar: {
      toolbarViewerLeft: {
        findbar: true,
        previous: true,
        next: true,
        pageNumber: false,
      },
      toolbarViewerRight: {
        presentationMode: true,
        openFile: false,
        print: false,
        download: false,
        viewBookmark: false,
      },
      toolbarViewerMiddle: {
        zoomOut: true,
        zoomIn: true,
        scaleSelectContainer: true,
      }
    },
  })

  // 消息输入框
  const prompt = ref<string>('')

  // loading状态和按钮状态
  const buttonDisabled = ref<boolean>(false)

  // 获取URL参数中的uuid
  const route = useRoute()
  let { uuid } = route.params as { uuid: string }

  // 会话列表和消息列表
  var conversationList = ref([])
  var messageList = ref([])

  let conversations = window.localStorage.getItem("chatStore")
  if(conversations){
    conversationList.value = JSON.parse(conversations)
  }

  // 判断是否是新会话
  if (!uuid || uuid === '0') {
    uuid = Date.now()

    // 初始化一个空的会话
    if(!conversations){
      conversationList.value.push({
        title: 'New Chat', 
        uuid: uuid, 
        isEdit: false, 
        createDate: new Date().toLocaleString(), 
        lastChatContent: 'Hello I am ChatGPT3.5...',
        active: true
      })
    }else{
      // 有历史会话，则取出最后一条会话
      let lastConversation = conversationList.value[conversationList.value.length-1]
      uuid = lastConversation.uuid

      let messages = window.localStorage.getItem(uuid)
      if(messages) {
        messageList.value = JSON.parse(messages)
      }

      router.push({ name: 'Chat', params: { uuid } })
    }
  }else{
    // 读取当前会话的的消息记录
    let messages = window.localStorage.getItem(uuid)
    if(messages) {
      messageList.value = JSON.parse(messages)
    }
  
    conversationList.value.forEach((item, index) => {
      if(item.uuid == uuid){
        item.active = true
      }else{
        item.active = false
      }
    })

    scrollToBottom()
  }

  // 新增空会话
  function handleAdd() {
    // 重置新会话的消息记录
    messageList.value = []

    // 重置会话列表的激活状态
    conversationList.value.forEach((item, index) => {
      item.active = false
    })

    // 初始化一个空的会话
    uuid = Date.now()

    conversationList.value.unshift({
      title: "New Chat",
      uuid: uuid,
      isEdit: false,
      createDate: new Date().toLocaleString(),
      lastChatContent: 'Hello I am ChatGPT3.5...',
      active: true
    })

    // 保存会话到本地存储
    window.localStorage.setItem("chatStore", JSON.stringify(conversationList.value))
  }

  // 菜单切换
  function handleMenu(){
    let rootbody = document.getElementById("rootbody")
    if(rootbody.classList.value==""){
      rootbody.classList.value="open-sidebar-menu"
    }else{
      rootbody.classList.value=""
    }
  }

  // 切换会话
  function handleSwitch(selectedUuid: string) {
    uuid = selectedUuid

    // 重置新会话的消息记录
    let messages = window.localStorage.getItem(selectedUuid)
    if(messages){
      messageList.value = JSON.parse(messages)
    }else{
      messageList.value = []
    }

    // 重置会话列表的激活状态
    conversationList.value.forEach((item, index) => {
      if(item.uuid == selectedUuid){
        item.active = true
      }else{
        item.active = false
      }
    })

    router.push({ name: 'Chat', params: { uuid } })
  }

  // 上传文件相关
  var fileName = ref()
  var fileSize = ref<number>(0)
  var fielUploadCard = ref<boolean>(false)

  var fileContent = ref()

  // 处理上传文档
  function handleUpload(e){
    if(e.target.files[0].size >= 5 * 1024 * 1024){
      alert('上传文件最大文件5M限制')
      return
    }

    // 设置上传文件样式
    fileName.value = e.target.files[0].name
    fileSize.value = e.target.files[0].size
    formatFileSize()

    // 预览pdf
    showTab.value = 'nav-tab-doc'
    tabWidth.value = 'width: 60%'

    pdfFile.value = URL.createObjectURL(e.target.files[0])

    // 上传文件解析出内容
    const formData = new FormData()
    formData.append('doc', e.target.files[0])

    fetch(import.meta.env.VITE_API_UPLOAD, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.text())
    .catch(error => console.error('Error:', error))
    .then(function (docContent) {
      const tokens = encode(docContent)

      if(tokens.length > 4096){
        alert("超出最大Tokens数量限制4096")
        fileName.value = ''
        fileSize.value = ''
      }else{
        // 设置读取出的内容
        fileContent.value = docContent

        // 显示上传卡片
        fielUploadCard.value = true
      }
    })
  }

  function handleBackChat(){
    showTab.value = 'nav-tab-chat'
    tabWidth.value = ''
  }

  function handleBackDoc(){
    showTab.value = 'nav-tab-doc'
    tabWidth.value = 'width: 40%'
  }

  // 格式化文件大小 单位：Bytes、KB、MB、GB
  function formatFileSize() {
    if (fileSize.value < 1024) {
        fileSize.value = fileSize.value + 'B';
    } else if (fileSize.value < (1024*1024)) {
        var temp = fileSize.value / 1024
        fileSize.value = temp.toFixed(2) + 'KB'
    } else if (fileSize.value < (1024*1024*1024)) {
        var temp = fileSize.value / (1024*1024)
        fileSize.value = temp.toFixed(2) + 'MB'
    } else {
        var temp = fileSize.value / (1024*1024*1024);
        fileSize.value = temp.toFixed(2) + 'GB'
    }
  }

  // 发送消息
  function handleSubmit() {
    onConversation()
  }

  // 流式请求ChatGPT3.5
  async function onConversation() {
    let message = prompt.value
    if (!message || message.trim() === '')
      return

    // 清空输入框 和 禁用按钮
    prompt.value = ''
    buttonDisabled.value = true
    fielUploadCard.value = false

    // 发送信息(用于本地显示, 不是直接发给GPT的消息)
    messageList.value.push({
      "send": {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": message, "fileName": fileName.value, "fileSize": fileSize.value}],
        "temperature": 0.7
      },
      "loading": true
    })

    scrollToBottom()

    // 流式请求ChatGPT3.5
    try {
      if(fileContent.value){
        message += ',上传文件内容如下：' + fileContent.value
      }

      let data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": message }],
        "temperature": 0.7,
        "stream": true
      }

      let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + import.meta.env.VITE_API_KEY,
      }

      //发起请求
      let response = await fetch(import.meta.env.VITE_APP_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      })

      // 发给ChatGPT后，立即重置上传文件相关状态
      fileName.value = ''
      fileSize.value = 0

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      // 读取流式返回的数据
      const reader = response.body.getReader()
      const textDecoder = new TextDecoder()
      let result = true
      while (result) {
        // 取出一个chunk
        const { done, value } = await reader.read()

        if (done) {
          console.log('Stream ended')
          result = false

          // 恢复按钮状态
          buttonDisabled.value = false
          fileContent.value = ''

          // 保存当前消息
          window.localStorage.setItem(uuid, JSON.stringify(messageList.value))
          window.localStorage.setItem("chatStore", JSON.stringify(conversationList.value))
          break
        }
    
        // 转换chunk字符串为数组
        let chunkText = textDecoder.decode(value)
        chunkText = chunkText.replace(/data:/g, '')
        let results = chunkText.split('\n\n').filter(Boolean)

        //遍历数组 取出多个chunk
        for (let i = 0; i < results.length; i++) {
          var chunk = results[i]
          if (chunk.indexOf('DONE') == -1){
            var chunkDate = JSON.parse(chunk)
            if(chunkDate.choices[0].delta.content){
              if(!messageList.value[messageList.value.length-1].receive){
                // 如果是第一次返回结果，直接设置状态
                messageList.value[messageList.value.length-1].receive = chunkDate
                messageList.value[messageList.value.length-1].loading = false
              }else{
                messageList.value[messageList.value.length-1].receive.choices[0].delta.content += chunkDate.choices[0].delta.content
              }

              scrollToBottom()
            }
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  function handleDele(selectedUuid: string){
    // 重置会话列表的激活状态
    conversationList.value.forEach((item, index) => {
      if(item.uuid == selectedUuid){
        conversationList.value.splice(index,1)

        // 保存会话到本地存储
        window.localStorage.setItem("chatStore", JSON.stringify(conversationList.value))
        return false
      }
    })

    // 重置新会话的消息记录
    if(uuid == selectedUuid){
      let messages = window.localStorage.getItem(selectedUuid)
      if(messages){
        window.localStorage.removeItem(selectedUuid)
        messageList.value = []
      }
    }
  }
</script>

<template>
  <div id="layout" class="theme-cyan">
      <!-- 侧边栏 -->
      <div class="navigation navbar justify-content-center py-xl-4 py-md-3 py-0 px-3">
        <a href="#" title="ChatGPT-UI" class="brand">
          <svg class="logo" viewBox="0 0 128 128" width="24" height="24" data-v-c0161dce=""><path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" data-v-c0161dce=""></path><path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" data-v-c0161dce=""></path></svg>
        </a>
        <div class="nav flex-md-column nav-pills flex-grow-1" role="tablist" aria-orientation="vertical">
          <a class="mb-xl-3 mb-md-2 nav-link active"  data-toggle="pill" href="#" role="tab">
            <i class="zmdi zmdi-comment-alt"></i>
          </a>
          <a class="mb-xl-3 mb-md-2 nav-link  d-none d-sm-block flex-grow-1" data-toggle="pill" href="#" role="tab">
            <i class="zmdi zmdi-layers"></i>
          </a>

          <a class="mt-xl-3 mt-md-2 nav-link light-dark-toggle" href="#">
            <i class="zmdi zmdi-brightness-2"></i>
            <input class="light-dark-btn" type="checkbox"></a>
          <a class="mt-xl-3 mt-md-2 nav-link d-none d-sm-block" href="#" role="tab">
            <i class="zmdi zmdi-settings"></i>
          </a>
        </div>
        <button type="submit" class="btn sidebar-toggle-btn shadow-sm" @click="handleMenu">
          <i class="zmdi zmdi-menu"></i>
        </button>
      </div>
      <!-- 侧边列表栏 -->
      <div class="sidebar border-end py-xl-4 py-3 px-xl-4 px-3" :style="tabWidth">
        <div class="tab-content">
          <!-- 会话记录 -->
          <div class="tab-pane fade active show" id="nav-tab-chat" role="tabpanel" v-if="showTab === 'nav-tab-chat'">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h3 class="mb-0 text-primary">ChatGPT-UI</h3>
              <div>
                <button class="btn btn-dark" type="button"  @click="handleAdd">New Chat</button></div>
            </div>
            <ul class="chat-list">
              <li class="header d-flex justify-content-between ps-3 pe-3 mb-1">
                <span>RECENT CHATS</span>
              </li>
              <li v-for="(item, index) in conversationList" :class="[item.active ? 'active' : '']" @click="handleSwitch(item.uuid)">
                <div class="hover_action">
                  <button type="button" class="btn btn-link text-info"><i class="zmdi zmdi-eye"></i></button>
                  <button type="button" class="btn btn-link text-danger" @click="handleDele(item.uuid)"><i class="zmdi zmdi-delete"></i></button>
                </div>
                <a href="#" class="card">
                  <div class="card-body">
                    <div class="media">
                      <div class="avatar me-3">
                        <span class="status rounded-circle"></span>
                        <img class="avatar rounded-circle" :style="[item.active ? 'filter:grayscale(0)' : 'filter:grayscale(1)']" src="../assets/chatgpt.jpg" alt="avatar"></div>
                      <div class="media-body overflow-hidden">
                        <div class="d-flex align-items-center mb-1">
                          <h6 class="text-truncate mb-0 me-auto">{{ item.title }}</h6>
                          <p class="small text-muted text-nowrap ms-4 mb-0">{{ item.createDate }}</p></div>
                        <div class="text-truncate">{{ item.lastChatContent }}</div></div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <!-- end 会话记录 -->
          <!-- PDF预览 -->
          <div class="tab-pane fade active show" id="nav-tab-doc" role="tabpanel" v-if="showTab === 'nav-tab-doc'">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h3 class="mb-0 text-primary">ChatGPT-PDF</h3>
              <div>
                <button class="btn btn-dark" type="button"  @click="handleBackChat">Back Chat</button></div>
            </div>
            <ul class="chat-list">
              <li class="header d-flex justify-content-between ps-3 pe-3 mb-1">
                <span>PREVIEW</span>
              </li>
              <li>
                <vue-pdf-app style="height: 100vh;" :config="config" :pdf="pdfFile"></vue-pdf-app>
              </li>
            </ul>
          </div>
          <!-- end PDF预览 -->
        </div>
      </div>

      <div class="main px-xl-5 px-lg-4 px-3">
        <div class="chat-body">
          <!-- 会话框头部 -->
          <div class="chat-header border-bottom py-xl-4 py-md-3 py-2">
            <div class="container-xxl">
              <div class="row align-items-center">
                <div class="col-6 col-xl-4">
                  <div class="media">
                    <div class="me-3 show-user-detail">
                      <span class="status rounded-circle"></span>
                      <img class="avatar rounded-circle" src="../assets/chatgpt.jpg" alt="avatar"></div>
                    <div class="media-body overflow-hidden">
                      <div class="d-flex align-items-center mb-1">
                        <h6 class="text-truncate mb-0 me-auto">ChatGPT 3.5</h6></div>
                      <div class="text-truncate">Power By OpenAI</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
           <!-- end 会话框头部 -->

          <div class="chat-content" id="scrollRef" ref="scrollRef">
            <div class="container-xxl">
              <ul class="list-unstyled py-4" v-for="(item, index) of messageList">
                <!-- 消息右 -->
                <li class="d-flex message right">
                  <div class="message-body">
                    <span class="date-time text-muted"></span>
                    <div class="message-row d-flex align-items-center justify-content-end">
                      <div class="message-content border p-3">
                        {{ item.send.messages[0].content }}
                        <div class="attachment" v-show="item.send.messages[0].fileName" @click="handleBackDoc">
                          <div class="media mt-2">
                            <div class="avatar me-2">
                              <div class="avatar rounded no-image orange">
                                <i class="zmdi zmdi-collection-pdf"></i>
                              </div>
                            </div>
                            <div class="media-body overflow-hidden">
                                <h6 class="text-truncate mb-0">{{ item.send.messages[0].fileName }}</h6>
                                <span class="file-size">{{ item.send.messages[0].fileSize }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <!-- end 消息右 -->
                <!-- 消息左 -->
                <li class="d-flex message" v-if="item.receive">
                  <div class="mr-lg-3 me-2">
                    <img class="avatar sm rounded-circle" src="../assets/chatgpt.jpg" alt="avatar"></div>
                  <div class="message-body">
                    <span class="date-time text-muted">{{ item.receive.model }}</span>
                    <div class="message-row d-flex align-items-center">
                      <div class="message-content p-3">{{ item.receive.choices[0].message?item.receive.choices[0].message.content:item.receive.choices[0].delta.content }}</div>
                    </div>
                  </div>
                </li>
                <!-- end 消息左 -->
                <!-- 消息loading -->
                <li class="d-flex message" v-if="item.loading">
                  <div class="mr-lg-3 me-2">
                    <img class="avatar sm rounded-circle" src="../assets/chatgpt.jpg" alt="avatar"></div>
                  <div class="message-body">
                    <div class="message-row d-flex align-items-center">
                      <div class="message-content p-3">
                        <div class="wave">
                          <span class="dot"></span>
                          <span class="dot"></span>
                          <span class="dot"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <!-- end 消息loading -->
              </ul>
            </div>
          </div>
          <!-- 发送消息框 -->
          <div class="chat-footer border-top py-xl-4 py-lg-2 py-2">
            <div class="container-xxl">
              <div class="row">
                <div class="col-12">
                  <div class="input-group align-items-center">
                    <input type="text" v-model="prompt" class="form-control border-0 pl-0" placeholder="Type your message...">
                    <div class="attachment" v-show="fielUploadCard" @click="handleBackDoc">
                      <div class="media mt-2">
                        <div class="avatar me-2">
                          <div class="avatar rounded no-image orange">
                            <i class="zmdi zmdi-collection-pdf"></i>
                          </div>
                        </div>
                        <div class="media-body overflow-hidden">
                          <h6 class="text-truncate mb-0">{{ fileName }}</h6>
                          <span class="file-size">{{ fileSize }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="input-group-append">
                      <span class="input-group-text border-0">
                        <input type="file" accept="application/pdf" id="fileInput" ref="file" @change="handleUpload" style="display:none">
                        <button class="btn btn-sm btn-link text-muted" data-toggle="tooltip" @click="$refs.file.click()" title="" type="button" data-original-title="Attachment"><i class="zmdi zmdi-attachment font-22"></i></button>
                      </span>
                    </div>
                    <div class="input-group-append">
                      <span class="input-group-text border-0 pr-0">
                        <button type="submit" class="btn btn-primary" :disabled="buttonDisabled" @click="handleSubmit">
                          <i class="zmdi zmdi-mail-send"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
           <!-- end 发送消息框 -->
        </div>
      </div>
      <!-- 空白页 -->
      <div class="main px-xl-5 px-lg-4 px-3" style="display:none">
        <div class="chat-body">
        <div class="chat d-flex justify-content-center align-items-center h-100 text-center py-xl-4 py-md-3 py-2">
          <div class="container-xxl">
          <div class="avatar lg avatar-bg me-auto ms-auto mb-5">
            <img class="avatar lg rounded-circle border" src="../assets/user.png" alt="">
            <span class="a-bg-1"></span>
            <span class="a-bg-2"></span>
          </div>
          <h5 class="font-weight-bold">Hey, Robert!</h5>
          <p>Please select a chat to start messaging.</p>
          </div>
        </div>
        </div>
      </div>
      <!-- end 空白页 -->
    </div>
</template>
