import { Notify } from 'quasar'

export const $notify = ({ caption, type = 'info' }) => {
  Notify.create({
    message: caption,
    type: type,
    position: 'top',
    timeout: 3000
  })
}