---
title: Polymorph Workbench
layout: WorkbenchPage
---

<script>
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', {
        scope: './'
    }).then(registration => {
        registration.addEventListener('updatefound', () => this._onUpdateFound(registration));
    });
}
</script>
