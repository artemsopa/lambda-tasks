const a = () => 'Hello';
console.log(a());

const b = () => {
  console.log('Ji');
};

b();

const helloYou = (name: string) => {
  console.log(`hello${name}!`);
};

helloYou('hello');
