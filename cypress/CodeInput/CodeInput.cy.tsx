import CodeInput from '../../src/technical-test/code-input/CodeInput';

function onCodeFull(code: string) {
  console.log({ code });
}

describe('CodeInput end2end test', () => {
  it("Composant CodeInput doit être rendu initialement, " +
  "c'est que il faut avoir 4 élements d'input", () => {
    cy.mount(<CodeInput length={4} onCodeFull={onCodeFull} />);
    cy.get('input').its('length').should('eq', 4);
  });

  it("après entrer une caractère, la duexième doit être focused " +
    "et la premiere input doit afficher la caractère déjà entrée", () => {
    cy.mount(<CodeInput length={4} onCodeFull={onCodeFull} />);
    const firstInput = cy.get('input').eq(0);
      // const secInput = cy.get('input').eq(1);
    const inputChar = '1';
    firstInput.type(inputChar);
    firstInput.should('have.value', inputChar);
    // secInput.should('have.focus');
    cy.focused().then(el => {
      const siblings = el.parent().children();
      assert.equal(siblings.index(el), 1, "la duexième n'est pas focused")
    });
  });

  it("élement d'input accept uniquement les chiffres", () => {
    cy.mount(<CodeInput length={4} onCodeFull={onCodeFull} />);
    const firstInput = cy.get('input').eq(0);
    const inputChar = 'a';
    firstInput.type(inputChar);
    firstInput.should('have.value', '');
  });

  it("après entrer 'Backspace', on peut effacer ou reculer", () => {
    cy.mount(<CodeInput length={4} onCodeFull={onCodeFull} />);
    const firstInput = cy.get('input').eq(0);
    const inputChar = '1';
    firstInput.type(inputChar);
    firstInput.should('have.value', inputChar);
    firstInput.type('{backspace}');
    firstInput.should('have.value', '');
  });

  it("après 4 fois d'entrées, 'onCodeFull' doit être appelée " +
  "et il faut imprimer les caractères entrées dans le console", ()  => {
    const input = '1234';
    const _onCodeFull = (str: string) => {
      assert.equal(str, input, "onCodeFull n'est pas appelée");
    }
    cy.mount(<CodeInput length={4} onCodeFull={_onCodeFull} />);
    const eles = cy.get('input');
    eles.its('length').should('eq', 4);
    for(let i = 0;i < 4;i++) {
      cy.get('input').eq(i).type(input[i], { delay: 300 });
    }
  });

});