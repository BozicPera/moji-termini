# Testing Checklist

Use this checklist to verify all improvements are working correctly.

## Quick Visual Tests (5 minutes)

- [ ] Open `index.html` in browser - page loads without errors
- [ ] Check browser console - no JavaScript errors
- [ ] Click all navigation links - smooth scrolling works
- [ ] Click mobile menu icon - menu opens/closes smoothly
- [ ] Press Tab key - see "Skip to main content" link appear
- [ ] Continue tabbing - visible focus indicators on all links/buttons
- [ ] Fill out contact form with invalid email - see validation error
- [ ] Submit form - see loading spinner on button
- [ ] Check all CTAs - buttons work and look good

## Accessibility Tests (10 minutes)

### Keyboard Navigation
- [ ] Tab through entire page - logical focus order
- [ ] Press Enter on "Skip to content" - jumps to hero section
- [ ] Navigate mobile menu with keyboard - can open/close
- [ ] Tab through form fields - all labels read correctly
- [ ] Press Enter on FAQ questions - accordions expand/collapse

### Screen Reader (Optional - if available)
- [ ] Logo SVG announces as "Moji Termini logo"
- [ ] Mobile menu announces "Meni" button
- [ ] Form success/error messages are announced
- [ ] All form labels are associated with inputs

### Touch Targets (Mobile)
- [ ] All buttons are easy to tap (44x44px minimum)
- [ ] No accidental taps between closely spaced elements

## Performance Tests (5 minutes)

### Lighthouse Audit
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Mobile" device
4. Check all categories
5. Click "Analyze page load"

**Expected Scores:**
- Performance: 85+ (will improve to 95+ with minification)
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### Manual Performance Check
- [ ] Page loads quickly (under 2 seconds on good connection)
- [ ] No layout shift when page loads
- [ ] Smooth scrolling animations
- [ ] Form submission feels responsive

## SEO Tests (10 minutes)

### Meta Tags
- [ ] View page source - see all Open Graph tags
- [ ] View page source - see Twitter Card tags
- [ ] View page source - see structured data scripts

### Social Sharing Preview
1. Go to https://www.opengraph.xyz/
2. Enter your page URL (or use file:// path for local testing)
3. Verify preview looks good

### Structured Data Validation
1. Go to https://validator.schema.org/
2. Copy HTML source code
3. Paste into validator
4. Verify no errors

## Form Testing (5 minutes)

### Validation Tests
- [ ] Submit empty form - see "popunite sva obavezna polja" error
- [ ] Enter invalid email (e.g., "test@") - see email validation error
- [ ] Enter valid data - form submits (may fail if backend not configured)
- [ ] Check loading state during submission

### Error Handling
- [ ] Turn off internet - submit form - see network error message
- [ ] Form maintains data on validation error (doesn't clear)

## Cross-Browser Testing (15 minutes)

Test in these browsers if available:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (Mac/iOS)
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)

Check:
- [ ] Layout looks correct
- [ ] Animations work smoothly
- [ ] Forms function properly
- [ ] No console errors

## Mobile Responsiveness (10 minutes)

### Browser DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test these viewports:
   - [ ] iPhone SE (375px) - smallest mobile
   - [ ] iPhone 12 Pro (390px) - common mobile
   - [ ] iPad (768px) - tablet
   - [ ] iPad Pro (1024px) - large tablet
   - [ ] Desktop (1920px) - large desktop

### Layout Checks
- [ ] Hero section looks good on mobile
- [ ] Stats stack vertically on mobile
- [ ] Feature cards stack on mobile (4→2→1 columns)
- [ ] Pricing cards stack on mobile
- [ ] Contact form looks good on mobile
- [ ] Footer stacks properly

## Regression Tests (5 minutes)

Ensure nothing broke:
- [ ] All sections render correctly
- [ ] All images/icons display
- [ ] Color scheme consistent throughout
- [ ] Typography looks professional
- [ ] No overlapping elements
- [ ] No broken layouts

## Advanced Tests (Optional)

### Slow Network Simulation
1. DevTools → Network tab → Throttling
2. Select "Slow 3G"
3. Reload page
4. Check loading experience

### Dark Mode (If applicable)
- [ ] Page looks acceptable in dark mode

### Print Preview
- [ ] Ctrl+P - page looks reasonable when printed

---

## Test Results Template

```
Date: _________
Tester: _________

Quick Visual Tests: PASS / FAIL
Accessibility: PASS / FAIL
Performance (Lighthouse):
  - Performance: ___/100
  - Accessibility: ___/100
  - Best Practices: ___/100
  - SEO: ___/100
SEO Tests: PASS / FAIL
Form Testing: PASS / FAIL
Cross-Browser: PASS / FAIL
Mobile Responsive: PASS / FAIL
Regression Tests: PASS / FAIL

Critical Issues Found:
1. _______________
2. _______________

Minor Issues Found:
1. _______________
2. _______________

Notes:
_______________
_______________
```

---

## Automated Testing Commands

If you have testing tools installed:

```bash
# HTML validation
npx html-validator-cli index.html

# Lighthouse CI
npx lighthouse https://your-domain.com --view

# Accessibility audit
npx pa11y https://your-domain.com

# Link checker
npx linkinator https://your-domain.com
```

---

## Priority Issue Severity

**Critical (Fix Immediately):**
- JavaScript errors
- Broken navigation
- Form not submitting
- Major accessibility violations

**High (Fix Soon):**
- Performance issues
- Mobile layout problems
- SEO meta tag issues

**Medium (Fix When Possible):**
- Minor accessibility improvements
- Visual polish
- Copy improvements

**Low (Nice to Have):**
- Animation refinements
- Micro-interactions
- Edge case handling

---

## Sign-Off

Once all tests pass:

- [ ] All Critical tests: PASS
- [ ] All High priority tests: PASS
- [ ] Lighthouse scores meet targets
- [ ] No console errors
- [ ] Works on primary target browsers
- [ ] Mobile experience is smooth

**Approved for Production:** Yes / No

**Signed:** _________________ **Date:** _________

---

**Pro Tips:**
- Test on real devices when possible (not just DevTools)
- Ask colleagues to test on their devices
- Test with actual screen readers if available
- Monitor analytics after launch for real-world performance
- Set up error tracking (Sentry, LogRocket) to catch issues
