document
  .getElementById('track-product-viewed')
  .addEventListener('click', () => {
    analytics.track('Product Viewed');
  });
document
  .getElementById('track-checkout-started')
  .addEventListener('click', () => {
    analytics.track('Checkout Started');
  });
document.getElementById('track-coupon-denied').addEventListener('click', () => {
  analytics.track('Coupon Denied');
});

document.getElementById('page-home').addEventListener('click', () => {
  analytics.page('Home');
});
document.getElementById('page-about').addEventListener('click', () => {
  analytics.page('About');
});
document.getElementById('page-contact').addEventListener('click', () => {
  analytics.page('Contact');
});

document.getElementById('identify-fathy').addEventListener('click', () => {
  analytics.identify('fathy');
});
document.getElementById('identify-spongebob').addEventListener('click', () => {
  analytics.identify('spongebob', { lastname: 'squarepants' });
});

document.getElementById('group').addEventListener('click', () => {
  analytics.group(
    'group name',
    {
      address: {
        city: 'Vancouver',
        country: 'Canada',
        postalCode: 'V6b3E2',
        state: 'BC',
        street: '21 Jump St'
      },
      avatar: 'does not exist',
      description: 'a fake group',
      email: 'email-me-not@domain.com',
      employees: 3,
      id: 1,
      industry: 'sw eng',
      name: 'libweb',
      phone: '555-pizza',
      website: 'www.google.com',
      plan: 'business'
    },
    {
      integrations: {
        All: true
      }
    },
    function() {
      console.log('group callback triggered');
    }
  );
});

document.getElementById('alias').addEventListener('click', () => {
  analytics.alias(
    'userId',
    'previous id',
    {
      integrations: { All: true }
    },
    function() {
      console.log('alias callback triggered');
    }
  );
});

document.getElementById('reset').addEventListener('click', () => {
  analytics.reset();
});

document.getElementById('unsafe-eval').addEventListener('click', () => {
  eval('console.log(1234567)');
});
