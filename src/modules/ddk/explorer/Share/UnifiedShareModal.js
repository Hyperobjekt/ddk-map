/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { useEffect, useState } from 'react'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import i18n from '@pureartisan/simple-i18n'
import copy from 'copy-to-clipboard'

import { TwitterShareBtn } from '.'
import { FacebookShareBtn } from '.'
import { MailShareBtn } from '.'
import { LinkShareBtn } from '.'
import useStore from './../store'
import {
  Backdrop,
  Fade,
  FormGroup,
  IconButton,
  Input,
} from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'

const UnifiedShareModal = props => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const unifiedShareModal = useStore(
    state => state.unifiedShareModal,
  )
  const closeModal = () => {
    setStoreValues({
      unifiedShareModal: false,
    })
  }
  const defaultRoute = useStore(state => state.defaultRoute)
  const shareHash = useStore(state => state.shareHash)
  const eventShareLink = useStore(
    state => state.eventShareLink,
  )

  console.log('HIHIHI, ', unifiedShareModal)

  const onCopy = () => {
    copy(location)
    setStoreValues({ eventShareLink: eventShareLink + 1 })
  }

  // Update value for share link only when window object exists.
  const [shareLinkValue, setShareLinkValue] = useState('')
  useEffect(() => {
    setShareLinkValue(
      !!shareHash
        ? window.location.origin +
            window.location.pathname +
            shareHash
        : window.location.origin +
            window.location.pathname +
            defaultRoute,
    )
  }, [shareHash])

  // Styles for this component.
  const styles = makeStyles(theme => ({
    root: {
      position: 'absolute',
      height: 240,
      width: 400,
      top: 'calc(50% - 100px) !important',
      left: 'calc(50% - 200px) !important',
      // inset: 'unset !important',
    },
    body: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    input: {
      width: 'calc(100% - 50px)',
      background: '#eaebf4',
      padding: theme.spacing(1),
    },
    shareButtons: {
      display: 'flex',
    },
    fileIcon: {
      '&:hover': {
        fill: 'black',
      },
    },
    shareButton: {
      '&:hover': {
        '& .social-icon': {
          fill: 'black',
        },
        color: 'gray',
        cursor: 'pointer',
      },
      '& .sr-only': { display: 'none' },
    },
  }))

  const classes = styles()

  return (
    <Modal
      open={!!unifiedShareModal}
      onClose={closeModal}
      className={classes.root}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={!!unifiedShareModal}>
        <div className={classes.body}>
          <h3>{i18n.translate('MODAL_SHARE_LINK_HEAD')}</h3>
          <div className={classes.shareButtons}>
            <TwitterShareBtn
              className={classes.shareButton}
            />
            <FacebookShareBtn
              className={classes.shareButton}
            />
            <MailShareBtn className={classes.shareButton} />
            <LinkShareBtn className={classes.shareButton} />
          </div>
          <p>{i18n.translate('MODAL_SHARE_LINK_INSTR')}</p>
          {i18n.translate('MODAL_SHARE_LINK_INPUT')}
          <br></br>
          <FormGroup row>
            <Input
              type="text"
              id="link"
              name="link"
              className={classes.input}
              value={shareLinkValue}
              // variant='filled'
              readOnly
              // disabled
              // fullWidth
            />
            <IconButton onClick={onCopy}>
              <FileCopy className={classes.fileIcon} />
            </IconButton>
          </FormGroup>
        </div>
      </Fade>
    </Modal>
  )
}

export default UnifiedShareModal
// /* eslint react/no-multi-comp: 0, react/prop-types: 0 */
// import React, { useEffect, useRef, useState } from 'react'
// import {
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Input,
//   InputGroup,
//   InputGroupAddon,
// } from 'reactstrap'
// import i18n from '@pureartisan/simple-i18n'
// import { FaCopy } from 'react-icons/fa'
// import copy from 'copy-to-clipboard'

// import { CoreButton } from './../../../core'
// import useStore from './../store'
// import TwitterShareBtn from './TwitterShareBtn'
// import FacebookShareBtn from './FacebookShareBtn'
// import MailShareBtn from './MailShareBtn'

// const UnifiedShareModal = props => {
//   // Generic store value setter.
//   const setStoreValues = useStore(
//     state => state.setStoreValues,
//   )
//   const { className } = props
//   const unifiedShareModal = useStore(
//     state => state.unifiedShareModal,
//   )
//   const toggle = () => {
//     setStoreValues({
//       unifiedShareModal: !unifiedShareModal,
//     })
//   }
//   const activeRoute = useStore(state => state.activeRoute)
//   const shareHash = useStore(state => state.shareHash)
//   const eventShareLink = useStore(
//     state => state.eventShareLink,
//   )

//   const onCopy = () => {
//     // console.log('oncopy')
//     copy(location)
//     setStoreValues({
//       eventShareLink: eventShareLink + 1,
//     })
//   }

//   // Update value for share link only when window object exists.
//   const [shareLinkValue, setShareLinkValue] = useState('')
//   useEffect(() => {
//     setShareLinkValue(
//       !!shareHash
//         ? window.location.origin +
//             window.location.pathname +
//             shareHash
//         : window.location.origin +
//             window.location.pathname +
//             activeRoute,
//     )
//   }, [shareHash])

//   return (
//     <div>
//       <Modal
//         isOpen={!!unifiedShareModal}
//         toggle={toggle}
//         className={className}
//         backdrop={true}
//         keyboard={true}
//         autoFocus={true}
//         centered={true}
//       >
//         <ModalHeader toggle={toggle}></ModalHeader>
//         <ModalBody>
//           <h3>{i18n.translate('MODAL_SHARE_LINK_HEAD')}</h3>
//           <TwitterShareBtn />
//           <FacebookShareBtn />
//           <MailShareBtn />
//           <p>{i18n.translate('MODAL_SHARE_LINK_INSTR')}</p>
//           {i18n.translate('MODAL_SHARE_LINK_INPUT')}
//           <InputGroup>
//             <Input value={shareLinkValue} readOnly={true} />
//             <InputGroupAddon addonType="append">
//               <Button color="secondary" onClick={onCopy}>
//                 <FaCopy />
//               </Button>
//             </InputGroupAddon>
//           </InputGroup>
//         </ModalBody>
//       </Modal>
//     </div>
//   )
// }

// export default UnifiedShareModal
