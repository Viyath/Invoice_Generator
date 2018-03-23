
    <script type="text/javascript">
      var counter = 0;
      var usernameAddButton = $('button[name="add-username"]');
      var usernameField = $('input[name="username"]');
      var usernameList = $('.username-list');

      usernameAddButton.click(function(){
        var username = usernameField.val().trim();
        if (username) {
          usernameList.append(buildEnteredUsernameElement(username));
          usernameField.val('');
        }
      });

      function buildEnteredUsernameElement(username) {
        var nameAttribute = 'name="username-' + (counter++) + '"';
        var valueAttribute = 'value="' + username + '"';    // XXX: Don't do this as it opens up a security problem
        var inputTag = ['<input', valueAttribute, nameAttribute, '/>'].join(' ');
        return '<li>' + inputTag + '</li>';
      }
    </script>