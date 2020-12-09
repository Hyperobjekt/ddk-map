### Description

Shared component used to generate the various sharing modals
(UnifiedShareModal, ShareLinkModal, and ShareEmbedModal),
which have much overlapping functionality.

### Examples

ShareEmbedModal.js:

```js
return (
  <GenericShareModal
    open={open}
    onClose={onClose}
    heading={i18n.translate('MODAL_SHARE_EMBED_HEAD')}
    showEmbedSection={true}
  />
)
```
