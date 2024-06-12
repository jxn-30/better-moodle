// types found out by reading the moodle source code
// may be incomplete at some points

export default interface CoreModalEvents {
    bodyRendered: 'modal:bodyRendered';
    cancel: 'modal-save-cancel:cancel';
    destroyed: 'modal:destroyed';
    hidden: 'modal:hidden';
    outsideClick: 'modal:outsideClick';
    save: 'modal-save-cancel:save';
    shown: 'modal:shown';
}
