module github.com/gforien/flightbeat

go 1.15

replace (
	github.com/Azure/go-autorest => github.com/Azure/go-autorest v12.2.0+incompatible
	github.com/Shopify/sarama => github.com/elastic/sarama v1.19.1-0.20200629123429-0e7b69039eec
	github.com/cucumber/godog => github.com/cucumber/godog v0.8.1
	github.com/docker/docker => github.com/docker/engine v0.0.0-20191113042239-ea84732a7725
	github.com/docker/go-plugins-helpers => github.com/elastic/go-plugins-helpers v0.0.0-20200207104224-bdf17607b79f
	github.com/dop251/goja => github.com/andrewkroh/goja v0.0.0-20190128172624-dd2ac4456e20
	github.com/dop251/goja_nodejs => github.com/dop251/goja_nodejs v0.0.0-20171011081505-adff31b136e6
	github.com/fsnotify/fsevents => github.com/elastic/fsevents v0.0.0-20181029231046-e1d381a4d270
	github.com/fsnotify/fsnotify => github.com/adriansr/fsnotify v0.0.0-20180417234312-c9bbe1f46f1d
	github.com/google/gopacket => github.com/adriansr/gopacket v1.1.18-0.20200327165309-dd62abfa8a41
	github.com/insomniacslk/dhcp => github.com/elastic/dhcp v0.0.0-20200227161230-57ec251c7eb3 // indirect
	github.com/tonistiigi/fifo => github.com/containerd/fifo v0.0.0-20190816180239-bda0ff6ed73c
	golang.org/x/tools => golang.org/x/tools v0.0.0-20200602230032-c00d67ef29d0 // release 1.14
)

require (
	github.com/Sirupsen/logrus v1.0.1-0.20170608221441-85b1699d5056 // indirect
	github.com/akavel/rsrc v0.9.0 // indirect
	github.com/dlclark/regexp2 v1.2.1 // indirect
	github.com/dop251/goja v0.0.0-20200912112403-81ddb8a7cc41 // indirect
	github.com/dop251/goja_nodejs v0.0.0-20200811150831-9bc458b4bbeb // indirect
	github.com/elastic/beats/v7 v7.0.0-alpha2.0.20200923080344-d2a89224e971
	github.com/elastic/go-sysinfo v1.4.0 // indirect
	github.com/fatih/color v1.9.0 // indirect
	github.com/go-sourcemap/sourcemap v2.1.3+incompatible // indirect
	github.com/josephspurrier/goversioninfo v1.2.0 // indirect
	github.com/magefile/mage v1.10.0
	github.com/mattn/go-colorable v0.1.7 // indirect
	github.com/mitchellh/gox v1.0.1
	github.com/mitchellh/hashstructure v1.0.0 // indirect
	github.com/pierrre/gotestcover v0.0.0-20160517101806-924dca7d15f0
	github.com/prometheus/procfs v0.1.3 // indirect
	github.com/rcrowley/go-metrics v0.0.0-20200313005456-10cdbea86bc0 // indirect
	github.com/reviewdog/reviewdog v0.10.2
	github.com/tsg/go-daemon v0.0.0-20200207173439-e704b93fd89b
	go.elastic.co/ecszap v0.2.0 // indirect
	go.uber.org/multierr v1.6.0 // indirect
	go.uber.org/zap v1.16.0 // indirect
	golang.org/x/crypto v0.0.0-20200820211705-5c72a883971a // indirect
	golang.org/x/lint v0.0.0-20200302205851-738671d3881b
	golang.org/x/net v0.0.0-20200904194848-62affa334b73 // indirect
	golang.org/x/sys v0.0.0-20200922070232-aee5d888a860 // indirect
	golang.org/x/text v0.3.3 // indirect
	golang.org/x/tools v0.0.0-20200923053713-ba800b16d873
	honnef.co/go/tools v0.0.1-2020.1.5 // indirect
	howett.net/plist v0.0.0-20200419221736-3b63eb3a43b5 // indirect
)
