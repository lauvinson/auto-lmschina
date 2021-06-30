// create by vinson on 2020/12/03
// auto learning
let page
let courseList; let courseIndex = 0
let newCourse = true; let coursePage; let courseTitle
let pager, nextPager
let playing

// 查找课程，分页
function searchCourseList () {
    while (1) {
        const listRow = document.getElementsByClassName('list-data')[0].children

        if (listRow) {
            for (let i = 0; i < listRow.length; i++) {
                const el = listRow[i]

                if (el.className === 'el-row') {
                    courseList = el.children
                }
            }

            break
        }
    }

    pager = document.getElementsByClassName('el-pager')[0].children

    if (pager) {
        for (let i = 0; i < pager.length; i++) {
            const pg = pager[i]

            if (pg.className === 'number active') {
                nextPager = pager[i + 1]
            }
        }
    }
}

// 翻页
function nextPage () {
    if (nextPager) {
        nextPager.click()
    } else {
        console.log('所有分页已完成')
    }
}

setInterval(function () {
    page = window.location.hash

    // 课程列表页面
    if (page.search('#/course/list') !== -1) {
        playing = false

        if (!courseList) {
            searchCourseList()
        } else {
            if (courseIndex < courseList.length) {
                courseIndex += 1
            } else {
                nextPage()
                // eslint-disable-next-line no-undef
                return
            }
        }

        coursePage = courseList[courseIndex].children[0].href
        courseTitle = courseList[courseIndex].children[0].children[0].children[0].children[1].children[0].innerText
        window.location.href = coursePage
        console.info(courseTitle)
    } else if (page.search('#/course/detail/chapter') !== -1) {
        playing = false
        // 课程详情页面
        const buttons = document.getElementsByClassName('el-button pi-btn')

        Array.prototype.forEach.call(buttons, function (primary) {
            if (primary.innerText === '立即学习') {
                primary.click()
            } else if (primary.innerText === '继续学习') {
                newCourse = false
                const learns = document.getElementsByClassName('content')

                for (let i = 0; i < learns.length; i++) {
                    const learn = learns[i].children

                    for (let j = 0; j < learn.length; j++) {
                        if (learn[j].children[1].children[0].className === 'status learning' || learn[j].children[1].children[0].className === 'status ready') {
                            learn[j].click()
                            return
                        }
                    }
                }

                window.location.href = '#/course/list'
            } else {
                window.location.href = '#/course/list'
            }
        })
    } else if (page.search('#/course/play') !== -1) {
        // 课程学习页面
        const buttons = document.getElementsByClassName('el-button el-button--primary el-button--medium')
        const video = document.getElementById('white-sdk-video-js_html5_api')
        const back = document.getElementsByClassName('el-icon-back pointer')[0]

        Array.prototype.forEach.call(buttons, function (primary) {
            if (primary.innerText === '下一节' || primary.innerText === '返回课程') {
                if (!newCourse) {
                    back.click()
                    return
                }

                primary.click()
                playing = false
            } else {
                if (video) {
                    if (!playing) {
                        video.playbackRate = 15.0
                        const playPromise = video.play()
                        video.addEventListener('pause', function () {
                            back.click()
                        })

                        if (playPromise !== undefined) {
                            playPromise.then(_ => {
                                // Automatic playback started!
                                // Show playing UI.
                            })
                                .catch(error => {
                                    // Auto-play was prevented
                                    // Show paused UI.
                                    console.error(error)
                                    back.click()
                                })
                        }

                        playing = true
                    }
                }
            }
        })
    } else {
        // eslint-disable-next-line no-undef
        alert('invalidate page')
    }
}, 1500)
