import { expect } from 'chai';
import 'core-js/fn/object';
import 'core-js/fn/set';
import 'core-js/fn/map';

it('not', () => {
  // 以降のassertionの打ち消し
  expect(() => {}).not.throw();
  expect(1).not.equal(2);

  // 安易にnotを利用して予期しない値を否定するのではなく、期待する値を書く方がベターだとしている
  let a = {b:1};
  expect({a:1}).not.equal(a); // {a:1,b:1}かもしれない、{b:2}かもしれない、この検証は弱い
  expect({b:1}).deep.equal({b:1}); // 期待するkey,valueを全て列挙するほうがベター
});

it('deep', () => {
  // equal/include/members/keys/propertyで利用できる
  // 参照の一致（===）ではなく、値の一致を検証する
  expect({a:1}).to.deep.equal({a:1});
  expect({a:{b:2}}).to.deep.equal({a:{b:2}});
});

it('nested', () => {
  // property/includeで利用できる
  // ドット記法/ブラケット記法が使える
  // 階層が深いオブジェクトを検証するにはいいかも
  expect({a:{b:{c:1}}}).to.have.nested.property('a.b.c');

  // キーを検証するにはproperty
  expect({a:{b:1}}).to.have.nested.property('a.b');

  // キーと値を検証するにはinclude
  expect({a:{b:1}}).to.have.nested.include({'a.b':1});

  // キーに "." や "[]" が含まれるケースではバックスペースを利用する
  expect({'.a':1}).to.have.nested.property('\\.a');
  expect({'[a]':1}).to.have.nested.property('\\[a\\]');
});

it('own', () => {
  // なぜかownはない
  //let foo = {a:1};
  //expect(foo).to.have.own.property('a');
});

it('orderd', () => {
  // 順番通りに並んでいるか検証する
  expect([3,2,1]).to.have.ordered.members([3,2,1]);
  expect([3,2,1]).not.to.have.ordered.members([1,2,3]);

  // includesと組み合わせると配列を切り出して検証できる
  expect([3,2,1]).to.have.includes.ordered.members([3,2]);

  // オブジェクト配列の検証
  expect([{a:1},{a:2},{a:3}]).to.have.deep.ordered.members([{a:1},{a:2},{a:3}]);
  expect([{a:1},{a:2},{a:3}]).to.have.includes.deep.ordered.members([{a:1},{a:2}]);
});

it('any', () => {
  // keysがいずれかの値を持っているか
  expect({a:1, b:2}).to.have.any.keys('a', 'b', 'c');

  // keysがいずれの値も持っていない
  expect({a:1, b:2}).to.not.have.any.keys('A', 'B');

  // allと似ているが、allは「全て」を検証するのに対してanyは「いずれか」を検証する
  expect({a:1, b:2}).to.have.any.keys('a', 'b', 'c'); // いずれかが一致
  expect({a:1, b:2}).to.have.all.keys('a', 'b'); // 全てが一致

  expect({a:1, b:2}).to.not.have.any.keys('A', 'B'); // いずれも一致しない
  expect({a:1, b:2}).to.not.have.all.keys('a', 'B'); // 全て一致（ひとつだけ一致しても一致とみなさない）
});

it('all', () => {
  // keysアサーションと組み合わせると、オブジェクトが全てのキーを持つことを検証できる
  expect({a:1, b:1}).to.have.all.keys('a', 'b');
  // expect({a:1, b:1}).to.have.all.keys('a'); fail

  // all,anyどちらも指定しない場合でもkeysアサーションによる検証は可能（デフォルトはall）
  // 読みやすさのために省略せずallを書いたほうが良い
  expect({a:1, b:1}).to.have.keys('a', 'b');
  // expect({a:1, b:1}).to.have.keys('a'); fail
});

it('a', () => {
  expect('foo').to.be.a('string');
  expect({}).to.be.a('object');
  expect(undefined).to.be.a('undefined');
  expect(new Error).to.be.a('error');
  // expect(Promise.resolve()).to.be.a('promise'); phantomJSにないので省略

  // 特定の型を期待したアサーションを呼ぶ時は、事前にaで型チェックしておくと異なる型が混入した時に予期しない動作を防ぐ事ができる
  // expect(undefined).to.be.includes(2);
  // object tested must be an array, a map, an object, a set, a string, or a weakset, but undefined given AssertionError

  // expect(undefined).to.be.a('array').that.includes(2);
  // expected undefined to be an array

  // また言語的な読みやすさを提供する
  expect({a:1}).to.have.property('a');
});

it('include', () => {
  // 文字列を渡すとsubstringとして動作
  expect('foobar').to.include('foo');
  expect('foobar').to.include('bar');

  // 配列を渡すと要素を検索
  expect(['foo', 'bar']).to.include('foo');
  expect(['foo', 'bar']).to.include('bar');

  // Setも検索可能 SameValueZero equalityというアルゴリズムが使われるらしい
  expect(new Set([1,2])).to.include(2);
  expect(new Map([['a', 1], ['b', 2]])).to.include(2);

  // includeはarray/stringに依存した検証のためa/anで型を事前チェックしておくと安全
  expect([1,2,3]).to.be.an('array').that.includes(2);

  // typescriptにownはない

  // includeは継承したプロパティも対象に含むため、自身のプロパティである事を検証するにはownPropertyを使用する
  Object.assign(Object.prototype, {a:1});

  expect({b:1}).to.include({a:1});
  expect({b:1}).to.not.ownProperty('a');
  expect({b:1}).to.ownProperty('b');
});

it('ok', () => {
  // 推奨される方法は厳密な（===による比較で）検証を行う事
  expect(1).to.equal(1);
  expect('1').to.equal('1');
  expect(true).to.be.true;

  // ==による緩い比較を行いたい場合はokを使用してtruthyかどうかの検証を行う事ができる（非推奨）
  expect(1).to.ok;
  expect('1').to.be.ok;
  expect(true).to.be.ok;
  expect([]).to.be.ok;
});

it('true', () => {
  // ===による比較でtrueかどうか検証
  expect(true).to.be.true;

  // true以外の値を全て許容してしまうため、非推奨
  expect(1).not.to.be.true;
  expect('1').not.to.true;

  // ===による厳密な比較をする事が推奨される
  expect(1).to.equal(1);
});

it('false', () => {
  expect(false).to.be.false;

  // false以外の値を全て許容してしまうため、非推奨
  expect(0).not.to.be.false;
  expect('').not.to.be.false;

  // ===による厳密な比較をする事が推奨される
  expect(0).to.equal(0);
});

it('null', () => {
  // ===による比較でnullかどうか検証
  expect(null).to.be.null;

  // null以外の値を全て許容してしまうため、非推奨
  expect(false).not.to.be.null;

  // ===による厳密な比較をする事が推奨される
  expect(false).to.be.false;
});

it('undefined', () => {});
it('NaN', () => {});

it('exist', () => {
  // ===による比較でnull/undefined以外の値である事を検証
  expect(1).to.be.exist;
  expect('').to.be.exist;
  expect([]).to.be.exist;

  // null/undefined以外の値を全て許容してしまうため、非推奨
  expect(0).to.be.exist;

  // ===による厳密な比較をする事が推奨される
  expect(0).to.equal(0);
});

it('empty', () => {
  // string/arrayのlengthが0である事を検証
  expect([]).to.be.empty;
  expect('').to.be.empty;

  // オブジェクトの場合は列挙可能なプロパティの数が0である事を検証
  expect({}).to.be.empty;

  // Set/Mapにも使える
  expect(new Set()).to.be.empty;
  expect(new Map()).to.be.empty;

  // 型に依存する検証のため、a/anで型チェックをしておくのが望ましい
  // （でもエラーメッセージが結構分かりやすい）
  expect([]).to.be.an('array').that.to.be.empty;

  // not+emptyの組み合わせより、明確に長さを指定した検証のほうが望ましい
  expect([1,2,3]).to.have.lengthOf(3);
  expect([1,2,3]).to.not.be.empty;
});

it('arguments', () => {
  // argumentsである事の検証
  !function foo() {
    expect(arguments).to.be.arguments;
  }();

  // not+argumentsの組み合わせより、明確に型を指定した検証のほうが望ましい
  expect('').to.not.be.arguments;
  expect('').to.be.a('string');
});

it('equal', () => {
  expect(1).to.equal(1);
  expect({a:1}).to.not.equal({a:1});

  // syntax sugarがいっぱいあるっぽい
  expect(1).to.eq(1);
  expect(1).to.equals(1);
});

it('eql', () => {
  // object を deep equalで比較する

  // equalだと落ちる
  // expect({a:1}).equal({a:1}); fail

  // equalの場合はdeepを使う
  expect({a:1}).deep.equal({a:1});

  // もしくはeqlを使う
  expect({a:1}).eql({a:1});

  // equal系のアサーションはnotで否定刷ることを非推奨としている
  // expectに書いたプロパティより、実際の値のほうがプロパティが多いケースが多々あるため検証が失敗する
  // notで否定するのではなくexpectに期待する値を全て列挙する事を推奨
  // これはequal()でも同じ事が言える
  expect({a:1}).not.eql({b:1}); // Not recommended
  expect({a:1, b:1}).eql({a:1, b:1}); // Recommended

  // deep.equalとeqlの違い
  // deepはその後のアサーションにも影響を与える
  // eqlは1回のみdeep equalで比較する
  expect({a:1}).deep.equal({a:1}).equal({a:1});
  // expect({a:1}).eql({a:1}).equal({a:1}); fail
});

it('above', () => {
  // n以上である事の検証
  expect(2).to.be.above(1);

  // 等価ではない
  expect(1).to.not.be.above(1);

  // dateもいける
  expect(new Date(2018, 1, 20)).to.be.above(new Date(2018, 1, 19));
  expect(new Date(2018, 1, 20, 10, 25)).to.above(new Date(2018, 1, 20, 10, 24));

  // not+aboveで範囲の広い値を否定するよりequalで明確に期待する値を指定するほうが推奨される
  expect(1).to.not.be.above(2);
  expect(2).to.be.equal(2);
});

it('least', () => {
  // nと等価またはn以上である事の検証
  expect(1).to.be.at.least(1);
  expect(2).to.be.at.least(1);

  // dateもいける
  expect(new Date(2018, 1, 20)).to.be.at.least(new Date(2018, 1, 19));
  expect(new Date(2018, 1, 20)).to.be.at.least(new Date(2018, 1, 20));
  expect(new Date(2018, 1, 20, 10, 25)).to.be.at.least(new Date(2018, 1, 20, 10, 24));
  expect(new Date(2018, 1, 20, 10, 25)).to.be.at.least(new Date(2018, 1, 20, 10, 25));

  // n以上を検証するより明確な値を指定するほうが推奨される
  expect('123').to.have.lengthOf(3); // recommended
  expect('123').to.have.lengthOf.at.least(3); // not recommended
});

it('below', () => {
  // n以下である事の検証
  expect(1).to.be.below(2);

  // 等価ではない
  expect(1).to.not.be.below(1);

  // dateもいける
  expect(new Date(2018, 1, 19)).to.be.below(new Date(2018, 1, 20));
  expect(new Date(2018, 1, 20, 10, 24)).to.below(new Date(2018, 1, 20, 10, 25));

  // not+belowで範囲の広い値を否定するよりequalで明確に期待する値を指定するほうが推奨される
  expect(2).to.not.be.below(1);
  expect(2).to.be.equal(2);

  // lengthOfと合わせて使う場合の推奨・非推奨も同じ（明確な値を期待するほうが良い）

  // lt/lessThanはbelowと同じ（どっちかがどっちかのエイリアス）
});

it('most', () => {
  // nと等価またはn以下である事の検証
  expect(1).to.be.at.most(1);
  expect(1).to.be.at.most(2);

  // dateもいける
  expect(new Date(2018, 1, 19)).to.be.at.most(new Date(2018, 1, 19));
  expect(new Date(2018, 1, 19)).to.be.at.most(new Date(2018, 1, 20));
  expect(new Date(2018, 1, 20, 10, 24)).to.be.at.most(new Date(2018, 1, 20, 10, 24));
  expect(new Date(2018, 1, 20, 10, 24)).to.be.at.most(new Date(2018, 1, 20, 10, 25));

  // n以上を検証するより明確な値を指定するほうが推奨される
  expect('123').to.have.lengthOf(3); // recommended
  expect('123').to.have.lengthOf.at.most(3); // not recommended
});

it('within', () => {
  // 期待する数値が範囲内にあるか検証
  expect(1).to.be.within(1, 3);
  expect(2).to.be.within(1, 3);
  expect(3).to.be.within(1, 3);

  // Dateもいける
  expect(new Date(2018, 1, 1)).to.be.within(new Date(2018, 1, 1), new Date(2018, 1, 3));
  expect(new Date(2018, 1, 2)).to.be.within(new Date(2018, 1, 1), new Date(2018, 1, 3));
  expect(new Date(2018, 1, 3)).to.be.within(new Date(2018, 1, 1), new Date(2018, 1, 3));

  // 範囲を指定するより明確な値を指定するほうが推奨される
  expect(2).to.be.equal(2);
  expect(2).to.be.within(1, 3);

  // lengthOfや否定についても同じ
  expect([1,2]).to.have.lengthOf(2);
  expect([1,2]).to.have.lengthOf.within(1, 3);

  expect(1).to.equal(1);
  expect(1).to.not.be.within(2, 4);
});

it('instanceof', () => {
  // 期待するコンストラクタを持つ事を検証
  class Cat {}
  expect(new Cat()).to.be.an.instanceOf(Cat);

  expect([]).to.be.an.instanceOf(Array);

  // instanceofでも同じ（エイリアス）
  expect([]).to.be.an.instanceof(Array);

  // TypeScript/Babelなどのトランスパイルにおいて、Array,Error,MapでinstanceOfが期待通りに動作しない事がある（ES5で起こるっぽい）
  // prototypeを明示的にセットする実装が紹介されている
});

it('property', () => {
  // 期待するプロパティを持つ事を検証する
  expect({a:1}).to.have.property('a');

  // 第二引数が与えられると値も検証する
  expect({a:1}).to.have.property('a', 1);

  // デフォルトでは===による比較が行われるため、==による比較をするにはdeepなどを併用する
  // expect({a: {b:1}}).to.have.property('a', {b:1}); fail
  expect({a: {b:1}}).to.have.deep.property('a', {b:1});

  // nestedと組み合わせ可能
  expect({a:{b:{c:1}}}).to.have.nested.property('a.b.c');

  // 否定
  expect({a:1}).to.not.have.property('b');
  
  // key,valueを同時に否定する事は推奨されない
  // keyがないのか、valueが違うのか明確でないため
  expect({a:1}).to.not.have.property('a', 3); // Not recommended
  expect({a:1}).to.not.have.property('b', 1); // Not recommended

  // keyのみ明確に指定、またはkey,valueを両方明確に指定
  expect({a:1}).to.have.property('a'); // Recommended
  expect({a:1}).to.have.property('a', 1); // Recommended

  // propertyは後続の検証のターゲットをプロパティの値に変化させる
  // propertyでkey,valueを検証し、続けてthatで型チェックする事も可
  expect({a:1}).to.have.property('a').that.is.a('number');
});

it('ownPropertyDescriptor', () => {
  // propertyを詳細に検証する
  expect({a: 1}).to.have.ownPropertyDescriptor('a', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: 1,
  });

  // 以降の検証のターゲットをプロパティの詳細に変更するため、つなげてプロパティの検証などが行える
  expect({a: 1}).to.have.ownPropertyDescriptor('a')
    .property('enumerable', true);

  // 以下2つはエイリアスのため作用は同じ
  expect({a: 1}).to.have.ownPropertyDescriptor('a');
  expect({a: 1}).to.haveOwnPropertyDescriptor('a');
});

it('lengthOf', () => {
  // 配列および文字列の長さの検証
  expect([1,2,3]).to.have.lengthOf(3);
  expect('123').to.have.lengthOf(3);

  // notで否定するのではなく明示的に期待する値を示す事が推奨
  expect('123').to.not.have.lengthOf(2); // Not recommended
  expect('123').to.have.lengthOf(3); // Recommended

  // 同じくaboveなどと組み合わせて曖昧に検証しない
  expect('123').to.have.lengthOf.above(2); // Not recommended
  expect('123').to.have.lengthOf.below(4); // Not recommended
  expect('123').to.have.lengthOf.within(2, 4); // Not recommended
});

it('match', () => {
  // 正規表現による一致を検証
  expect('foobar').to.match(/^foo/);
  expect('foobar').to.not.match(/^bbb/);
});

it('string', () => {
  // substringによる比較
  expect('foobar').to.have.string('foo');
  expect('foobar').to.have.string('ooba');
  expect('foobar').to.have.string('bar');
});

it('key', () => {
  expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
  expect({a: 1, b: 1}).to.have.any.keys('a');

  // String/Arrayもサポートしているけど正直使い所が分からない
  expect(['a', 'b']).to.have.any.keys(0);
});

it('throw', () => {});
it('respondTo', () => {
  // 指定した名前のメソッドを持つ事が検証される

  // function
  function Foo() {}
  Foo.prototype.foo = function () {};
  
  expect(Foo).to.respondTo('foo');

  // class
  class Bar {
    bar() {}
  }
  expect(Bar).to.respondTo('bar');

  // object
  let obj = {
    foo: () => {}
  };

  expect(obj).to.respondTo('foo');
});

it('itself', () => {
  // respondToと組み合わせて、自分自身の持つメソッドかどうかを検証できる
  function Foo() {}
  Foo.prototype.foo = () => {};

  expect(Foo).to.respondTo('foo');
  expect(Foo).not.itself.to.respondTo('foo');
});

it('satisfy', () => {
  // 条件を満たすための関数を渡す事ができる
  expect(1).to.satisfy((n:number) => n > 0);
  expect(1).to.not.satisfy((n:number) => n < 0);

  // エイリアスsatisfiesも使う事ができる
  expect(1).to.satisfies((n:number) => n > 0);
});

it('closeTo', () => {
  // 範囲内にあるかどうか検証
  expect(1.0).to.be.closeTo(1, 0.5); // 1から1+0.5の範囲内にあるか
  expect(1.5).to.be.closeTo(1, 0.5);
  expect(1.6).not.to.be.closeTo(1, 0.5);

  // 範囲指定の意味ではwithinと似ているが、withinはstartからendで範囲を指定する
  expect(1.0).to.be.within(1, 1.5);
  expect(1.5).to.be.within(1, 1.5);
  expect(1.6).not.to.be.within(1, 1.5);
});

it('members', () => {
  // 要素を持っている事を検証
  expect([1,2,3]).to.have.members([1,2,3]);

  // 順番は問わない
  expect([1,2,3]).to.have.members([3,1,2]);

  // 順案も検証するにはorderdを使用
  expect([1,2,3]).to.have.ordered.members([1,2,3]);
  expect([1,2,3]).not.to.have.ordered.members([3,1,2]);

  // includeを使用すると一部を含む事を検証できる
  expect([1,2,3]).to.have.include.members([2,1]);
  expect([1,2,3]).to.have.include.ordered.members([1,2]); // 順番も検証

  // オブジェクトを==で比較する時はdeepを使用する
  expect([{a:1}]).to.have.deep.members([{a:1}]);
});

it('oneOf', () => {
  // 値がリストのいずれかに一致するかどうか
  expect(1).to.be.oneOf([1,2,3]);
  expect(100).to.not.be.oneOf([1,2,3]);

  // equalで明示的に期待する値を記述するほうが推奨される
  expect(1).to.be.equal(1);
});

it('change', () => {
  // 値が変化する事を検証

  // 関数を渡した場合：
  // fn2を実行し、fn1実行後にfn2を再度実行
  // fn2の実行結果が1回目と2回目で變化している事を検証
  // TypeScriptは一つ以上の引数を渡さないと警告が表示されるためnull/undefinedを渡す
  let foo = 0;
  let fn1 = () => foo = 1;
  let fn2 = () => foo;
  expect(fn1).to.change(fn2, undefined);

  // オブジェクトを渡した場合：
  // fn3の実行がプロパティを變化させている事を検証
  let obj = { bar: 1 };
  let fn3 = () => obj.bar++;

  expect(fn3).to.change(obj, 'bar');

  // 変化する値が不確定なため、equalで明確に値を指定した検証が推奨される
  obj.bar = 1;
  fn3();
  expect(obj.bar).to.be.equal(2);
});

it('increase', () => {
  // 値がプラス方向に変化する事を検証
  let foo = 0;
  let inc = () => foo += 100;
  let getFoo = () => foo;

  // TypeScriptは一つ以上の引数を渡さないと警告が表示されるためnull/undefinedを渡す

  expect(inc).to.increase(getFoo, undefined);

  // 変化がない事を検証するにはnotでなくchangeの使用が推奨される
  let noop = () => {};
  expect(noop).not.to.increase(getFoo, undefined); // Not recommended
  expect(noop).not.to.change(getFoo, undefined);

  // TypeScriptにbyがない
  // expect(inc).to.increase(getFoo, undefined).by(100);
});

it('decrease', () => {
  // 値がマイナス方向に変化する事を検証
  let foo = 0;
  let inc = () => foo -= 100;
  let getFoo = () => foo;

  // TypeScriptは一つ以上の引数を渡さないと警告が表示されるためnull/undefinedを渡す

  expect(inc).to.decrease(getFoo, undefined);

  // 変化がない事を検証するにはnotでなくchangeの使用が推奨される
  let noop = () => {};
  expect(noop).not.to.decrease(getFoo, undefined); // Not recommended
  expect(noop).not.to.change(getFoo, undefined);

  // TypeScriptにbyがない
  // expect(inc).to.decrease(getFoo, undefined).by(100);
});

it('by', () => {
  // TypeScriptの型にbyがない
});

it('extensible', () => {
  // プロパティ追加が可能か検証する
  expect({}).to.be.extensible;

  class A {}
  expect(new A()).to.be.extensible;

  expect([]).to.be.extensible;

  expect(1).to.not.be.extensible;
  expect('text').to.not.be.extensible;
  expect(null).to.not.be.extensible;
  expect(false).to.not.be.extensible;
  expect(undefined).to.not.be.extensible;

  // プロパティの追加削除不可
  let sealed = Object.seal({});
  expect(sealed).to.not.be.extensible;

  // プロパティ追加削除不可、値変更、列挙や書き込み設定の変更
  let frozen = Object.freeze({});
  expect(frozen).to.not.be.extensible;
});

it('sealed', () => {
  // sealed状態か検証する（プロパティ追加不可）
  let notSealed = {};
  expect(notSealed).to.not.be.sealed;

  let sealed = Object.seal({});
  expect(sealed).to.be.sealed;
  
  // プリミティブは常にsealed
  expect(1).to.be.sealed;
  expect('text').to.be.sealed;
  expect(true).to.be.sealed;
});

it('frozen', () => {
  // frozen状態か検証する（プロパティ追加削除不可、値変更、列挙や書き込み設定の変更）
  let notFrozen = {};
  expect(notFrozen).to.not.be.frozen;

  let frozen = Object.freeze({});
  expect(frozen).to.be.frozen;

  expect(1).to.be.frozen;
  expect('text').to.be.frozen;
  expect(true).to.be.frozen;
});

it('finite', () => {
  // numberかつNaN/Infinityでない事を検証
  // expect(1).to.be.finite;

  // TypeScriptにfiniteの型がない
});

it('fail', () => {
  // let fn = () => { throw new Error() };
  // expect(fn).to.be.fail();
  
  // TypeScriptにfailがない
});
