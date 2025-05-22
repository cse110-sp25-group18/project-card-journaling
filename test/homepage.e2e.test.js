describe('Test basic user flow on homepage', () => {

  beforeAll(async () => {
    await page.goto('https://cse110-sp25-group18.github.io/project-card-journaling/');
  });

  it('Check that nav buttons loaded', async () => {
    console.log('Checking that nav buttons loaded...');

    const navButtons = await page.$$eval('nav a', (buttons) => {
      return buttons.map((button) => {
        return button.textContent.trim();
      })
    });

    expect(navButtons.includes('Home')).toBe(true);
    expect(navButtons.includes('Create Card')).toBe(true);
    expect(navButtons.includes('Past Entries')).toBe(true);
    expect(navButtons.includes('Shuffle Recap')).toBe(true);
    expect(navButtons.includes('Settings')).toBe(true);
  });

  it.skip(`Check clicking on 'Home' button`, async () => {
    // TODO
  });
});