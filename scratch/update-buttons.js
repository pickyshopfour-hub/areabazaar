const fs = require('fs');

// 1. Update uwanbuy/index.html
if (fs.existsSync('uwanbuy/index.html')) {
  let uwanHtml = fs.readFileSync('uwanbuy/index.html', 'utf8');
  
  // Style definition for nav action buttons
  const uwanButtonStyles = `
        /* Enhanced solid nav buttons */
        .nav-action-btn-pill {
            padding: 9px 22px !important;
            font-weight: 700 !important;
            font-size: 0.92rem !important;
            min-height: 42px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 50px !important;
            transition: all 0.2s ease !important;
        }
        .nav-signin-btn {
            border: 2px solid #0f172a !important;
            color: #0f172a !important;
            background-color: #ffffff !important;
        }
        .nav-signin-btn:hover {
            background-color: #0f172a !important;
            color: #ffffff !important;
        }
        .nav-register-btn {
            background-color: var(--uw-brand) !important;
            color: #ffffff !important;
            border: 2px solid var(--uw-brand) !important;
            box-shadow: 0 4px 14px rgba(220, 38, 38, 0.25) !important;
        }
        .nav-register-btn:hover {
            background-color: var(--uw-brand-hover) !important;
            border-color: var(--uw-brand-hover) !important;
            color: #ffffff !important;
            transform: translateY(-1px) !important;
        }
        .nav-cart-btn {
            padding: 9px 20px !important;
            font-weight: 700 !important;
            min-height: 42px !important;
            border-radius: 50px !important;
        }
  `;
  
  if (!uwanHtml.includes('.nav-action-btn-pill')) {
    uwanHtml = uwanHtml.replace('</style>', uwanButtonStyles + '\n    </style>');
  }

  // Update button elements in navbar
  uwanHtml = uwanHtml.replace(
    /class="btn btn-brand position-relative shadow-sm px-3 py-2 d-inline-flex align-items-center gap-2 text-nowrap flex-shrink-0"/g,
    'class="btn btn-brand nav-action-btn-pill nav-cart-btn position-relative shadow-sm d-inline-flex align-items-center gap-2 text-nowrap flex-shrink-0"'
  );
  uwanHtml = uwanHtml.replace(
    /class="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold text-nowrap" id="btn-login-trigger"/g,
    'class="btn nav-action-btn-pill nav-signin-btn text-nowrap" id="btn-login-trigger"'
  );
  uwanHtml = uwanHtml.replace(
    /class="btn btn-brand rounded-pill px-4 py-2 fw-semibold text-nowrap" id="btn-register-trigger"/g,
    'class="btn nav-action-btn-pill nav-register-btn text-nowrap" id="btn-register-trigger"'
  );

  fs.writeFileSync('uwanbuy/index.html', uwanHtml, 'utf8');
  console.log('Updated uwanbuy buttons');
}

// 2. Update thriftz/index.html
if (fs.existsSync('thriftz/index.html')) {
  let tzHtml = fs.readFileSync('thriftz/index.html', 'utf8');
  const tzButtonStyles = `
        .nav-action-btn-pill {
            padding: 9px 22px !important;
            font-weight: 700 !important;
            font-size: 0.92rem !important;
            min-height: 42px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 50px !important;
            transition: all 0.2s ease !important;
        }
        .nav-signin-btn {
            border: 2px solid #121813 !important;
            color: #121813 !important;
            background-color: #ffffff !important;
        }
        .nav-signin-btn:hover {
            background-color: #121813 !important;
            color: #ffffff !important;
        }
        .nav-register-btn {
            background-color: var(--tz-primary) !important;
            color: #ffffff !important;
            border: 2px solid var(--tz-primary) !important;
            box-shadow: 0 4px 14px rgba(10, 104, 16, 0.25) !important;
        }
        .nav-register-btn:hover {
            background-color: var(--tz-primary-hover) !important;
            border-color: var(--tz-primary-hover) !important;
            color: #ffffff !important;
        }
  `;
  if (!tzHtml.includes('.nav-action-btn-pill')) {
    tzHtml = tzHtml.replace('</style>', tzButtonStyles + '\n    </style>');
  }
  tzHtml = tzHtml.replace(
    /class="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold text-nowrap" id="btn-login-trigger"/g,
    'class="btn nav-action-btn-pill nav-signin-btn text-nowrap" id="btn-login-trigger"'
  );
  tzHtml = tzHtml.replace(
    /class="btn btn-success rounded-pill px-4 py-2 fw-semibold text-nowrap"\s+id="btn-register-trigger"/g,
    'class="btn nav-action-btn-pill nav-register-btn text-nowrap" id="btn-register-trigger"'
  );
  fs.writeFileSync('thriftz/index.html', tzHtml, 'utf8');
  console.log('Updated thriftz buttons');
}

// 3. Update betasup/index.html
if (fs.existsSync('betasup/index.html')) {
  let betaHtml = fs.readFileSync('betasup/index.html', 'utf8');
  const betaButtonStyles = `
        .nav-action-btn-pill {
            padding: 9px 22px !important;
            font-weight: 700 !important;
            font-size: 0.92rem !important;
            min-height: 42px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 50px !important;
            transition: all 0.2s ease !important;
        }
        .nav-signin-btn {
            border: 2px solid #0f172a !important;
            color: #0f172a !important;
            background-color: #ffffff !important;
        }
        .nav-signin-btn:hover {
            background-color: #0f172a !important;
            color: #ffffff !important;
        }
        .nav-register-btn {
            background-color: var(--primary-amber) !important;
            color: #ffffff !important;
            border: 2px solid var(--primary-amber) !important;
            box-shadow: 0 4px 14px rgba(255, 140, 0, 0.28) !important;
        }
        .nav-register-btn:hover {
            background-color: var(--primary-orange) !important;
            border-color: var(--primary-orange) !important;
            color: #ffffff !important;
        }
  `;
  if (!betaHtml.includes('.nav-action-btn-pill')) {
    betaHtml = betaHtml.replace('</style>', betaButtonStyles + '\n    </style>');
  }
  betaHtml = betaHtml.replace(
    /class="btn btn-dark rounded-pill px-4 py-2 fw-600 text-nowrap">Login<\/button>/g,
    'class="btn nav-action-btn-pill nav-signin-btn text-nowrap" id="btn-login-trigger">Login</button>'
  );
  betaHtml = betaHtml.replace(
    /class="btn btn-amber rounded-pill px-4 py-2 fw-600 text-nowrap">Register<\/button>/g,
    'class="btn nav-action-btn-pill nav-register-btn text-nowrap" id="btn-register-trigger">Register</button>'
  );
  fs.writeFileSync('betasup/index.html', betaHtml, 'utf8');
  console.log('Updated betasup buttons');
}

