import { useEffect, createRef } from 'react'
import { Remarkable } from 'remarkable'

import { Row, Col } from '@senswap/sen-ui'

import util from 'helpers/util'

const ERROR = '<p>Cannot load the README.md</p>'

const Markdown = ({ appName }: { appName: string }) => {
  const ref = createRef<HTMLElement>()
  useEffect(() => {
    ;(async () => {
      try {
        // Read stream data
        const folderName = util.normalizeAppName(appName)
        const src =
          require(`applications/${folderName}/assets/README.md`).default
        const txt = await (await fetch(src)).text()
        // Parse data
        const md = new Remarkable({ html: true })
        if (ref.current) ref.current.innerHTML = md.render(txt)
      } catch (er) {
        if (ref.current) ref.current.innerHTML = ERROR
      }
    })()
  }, [appName, ref])
  // render data
  return (
    <Row gutter={[16, 16]}>
      <Col span={24} ref={ref} />
    </Row>
  )
}

export default Markdown
