const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

registerBlockType('fertility-check/fertility-widget', {
  title: __('SORA Fertility', 'fertility-check'),
  description: __('Insert the SORA Fertility risk awareness widget.', 'fertility-check'),
  icon: 'heart',
  category: 'widgets',
  keywords: ['fertility', 'risk', 'assessment'],

  edit: function() {
    return wp.element.createElement('div', { className: 'fc-block-preview' }, [
      wp.element.createElement('span', { className: 'fc-block-preview-icon' }, '\uD83C\uDF38'),
      wp.element.createElement('h3', null, __('SORA Fertility', 'fertility-check')),
      wp.element.createElement('p', null, __('The interactive fertility risk awareness tool will appear here on the published page.', 'fertility-check'))
    ]);
  },

  save: function() {
    return null;
  }
});
