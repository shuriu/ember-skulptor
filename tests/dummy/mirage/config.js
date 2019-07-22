export default function() {
  this.get('/articles/:id');

  this.passthrough();
}
