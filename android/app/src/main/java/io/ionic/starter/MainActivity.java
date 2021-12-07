package io.ionic.starter;
import com.getcapacitor.community.database.sqlite.CapacitorSQLite;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
   // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      add(CapacitorSQLite.class);
    }});
}
